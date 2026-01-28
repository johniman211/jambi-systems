-- Create system_requests table
CREATE TABLE IF NOT EXISTS system_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  business_type TEXT NOT NULL,
  system_category TEXT NOT NULL,
  problem TEXT NOT NULL,
  goals TEXT,
  payments TEXT[] NOT NULL,
  requires_login TEXT NOT NULL,
  timeline TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  additional_info TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new',
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_system_requests_status ON system_requests(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_system_requests_created_at ON system_requests(created_at DESC);

-- Create index on system_category for filtering
CREATE INDEX IF NOT EXISTS idx_system_requests_system_category ON system_requests(system_category);

-- Create index on budget_range for filtering
CREATE INDEX IF NOT EXISTS idx_system_requests_budget_range ON system_requests(budget_range);

-- Enable Row Level Security
ALTER TABLE system_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for form submissions)
CREATE POLICY "Anyone can insert system_requests"
  ON system_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can select
CREATE POLICY "Authenticated users can select system_requests"
  ON system_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can update
CREATE POLICY "Authenticated users can update system_requests"
  ON system_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Note: No DELETE policy - requests should not be deleted, only status changed to 'closed'
