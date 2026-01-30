-- Exchange Rate Settings Migration
-- Allows admin to configure SSP to USD exchange rate

-- Create settings table for store configuration
CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Insert default exchange rate (5000 SSP = 1 USD)
INSERT INTO store_settings (key, value)
VALUES ('exchange_rate', '{"ssp_to_usd": 5000, "updated_at": "2024-01-30T00:00:00Z"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- RLS policies
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read settings" ON store_settings;
DROP POLICY IF EXISTS "Service role can manage settings" ON store_settings;

CREATE POLICY "Anyone can read settings"
  ON store_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can manage settings"
  ON store_settings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index
CREATE INDEX IF NOT EXISTS idx_store_settings_key ON store_settings(key);
