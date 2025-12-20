/*
  # Medicare Mastery Enrollments Schema

  1. New Tables
    - `enrollments`
      - `id` (uuid, primary key) - Unique enrollment identifier
      - `email` (text, unique) - User's email address
      - `full_name` (text) - User's full name
      - `phone` (text) - Contact phone number
      - `payment_status` (text) - Status: pending, completed, failed
      - `payment_amount` (numeric) - Amount paid
      - `stripe_payment_intent_id` (text, nullable) - Stripe payment reference
      - `created_at` (timestamptz) - Enrollment timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `enrollments` table
    - Add policy for users to read their own enrollment data
    - Add policy for inserting new enrollments

  3. Indexes
    - Index on email for faster lookups
    - Index on payment_status for filtering
*/

CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_amount numeric NOT NULL,
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_email ON enrollments(email);
CREATE INDEX IF NOT EXISTS idx_enrollments_payment_status ON enrollments(payment_status);
CREATE INDEX IF NOT EXISTS idx_enrollments_created_at ON enrollments(created_at DESC);

-- Enable RLS
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert enrollments (for sign-up)
CREATE POLICY "Anyone can create enrollment"
  ON enrollments
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow users to read their own enrollment by email
CREATE POLICY "Users can read own enrollment"
  ON enrollments
  FOR SELECT
  TO anon
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();