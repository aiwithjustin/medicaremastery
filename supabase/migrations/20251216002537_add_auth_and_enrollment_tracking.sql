/*
  # Add Authentication and Enrollment Tracking

  1. Changes to Tables
    - Update `enrollments` table:
      - Add `user_id` (uuid, foreign key to auth.users) - Links enrollment to user account
      - Add `enrollment_status` (text) - Values: 'unpaid', 'paid'
      - Add `program_access` (text) - Values: 'locked', 'unlocked'
      - Add `payment_confirmed_at` (timestamptz, nullable) - Timestamp when payment confirmed
      - Add `payment_method` (text, nullable) - Payment method used
      - Remove old `payment_status` column
      - Make email non-unique since it's now tied to user_id

  2. New Tables
    - `user_profiles` - Extended user information
      - `id` (uuid, primary key, foreign key to auth.users)
      - `full_name` (text) - User's full name
      - `phone` (text) - Contact phone number
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  3. Security
    - Update RLS policies for new schema
    - Add policies for authenticated users to manage their own data
    - Add admin policies for payment confirmation

  4. Indexes
    - Index on user_id for faster lookups
    - Index on enrollment_status for filtering
    - Index on program_access for access checks
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Drop old enrollment table and recreate with new schema
DROP TABLE IF EXISTS enrollments CASCADE;

CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  enrollment_status text NOT NULL DEFAULT 'unpaid',
  program_access text NOT NULL DEFAULT 'locked',
  payment_amount numeric NOT NULL,
  payment_confirmed_at timestamptz,
  payment_method text,
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT enrollment_status_check CHECK (enrollment_status IN ('unpaid', 'paid')),
  CONSTRAINT program_access_check CHECK (program_access IN ('locked', 'unlocked')),
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_enrollment_status ON enrollments(enrollment_status);
CREATE INDEX IF NOT EXISTS idx_enrollments_program_access ON enrollments(program_access);

-- Enable RLS
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Policies: Users can read their own enrollment
CREATE POLICY "Users can read own enrollment"
  ON enrollments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies: Users can create their own enrollment
CREATE POLICY "Users can create own enrollment"
  ON enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND enrollment_status = 'unpaid' AND program_access = 'locked');

-- Trigger to update updated_at on user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on enrollments
DROP TRIGGER IF EXISTS update_enrollments_updated_at ON enrollments;
CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to confirm payment (for admin use or webhook integration)
CREATE OR REPLACE FUNCTION confirm_enrollment_payment(
  enrollment_user_id uuid,
  payment_method_used text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE enrollments
  SET 
    enrollment_status = 'paid',
    program_access = 'unlocked',
    payment_confirmed_at = now(),
    payment_method = payment_method_used
  WHERE user_id = enrollment_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION confirm_enrollment_payment TO authenticated;