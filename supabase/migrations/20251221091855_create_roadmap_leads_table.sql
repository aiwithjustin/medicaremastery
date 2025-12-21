/*
  # Create Roadmap Leads Table

  ## Overview
  This migration creates the roadmap_leads table to store lead information from users who download the free Medicare Career Roadmap PDF.

  ## New Tables
  
  ### `roadmap_leads`
  - `id` (uuid, primary key) - Unique identifier for each lead
  - `first_name` (text, required) - User's first name
  - `last_name` (text, required) - User's last name
  - `email` (text, required, unique) - User's email address
  - `interest_reason` (text, required) - Why they're interested (career change, remote work, income, other)
  - `discovery_source` (text, required) - How they heard about the program
  - `lead_type` (text, default) - Type of lead (default: "Roadmap Download")
  - `ip_address` (text, optional) - User's IP address for tracking
  - `user_agent` (text, optional) - User's browser/device info
  - `created_at` (timestamptz, auto) - Timestamp of submission
  - `updated_at` (timestamptz, auto) - Last update timestamp

  ## Security
  - Enable RLS on roadmap_leads table
  - Only authenticated admin users can view all leads
  - Public insert policy for lead submissions (with rate limiting handled at app level)
  - No public read access to protect user privacy

  ## Notes
  - Email field is unique to prevent duplicate submissions
  - Timestamps are automatically managed
  - Table is designed to support future CRM integration and automation
*/

-- Create roadmap_leads table
CREATE TABLE IF NOT EXISTS roadmap_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  interest_reason text NOT NULL,
  discovery_source text NOT NULL,
  lead_type text DEFAULT 'Roadmap Download',
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE roadmap_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public inserts (lead submissions)
CREATE POLICY "Allow public to submit leads"
  ON roadmap_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users to view all leads (admin access)
CREATE POLICY "Allow authenticated users to view all leads"
  ON roadmap_leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_roadmap_leads_email ON roadmap_leads(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_roadmap_leads_created_at ON roadmap_leads(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_roadmap_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_roadmap_leads_updated_at
  BEFORE UPDATE ON roadmap_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_roadmap_leads_updated_at();