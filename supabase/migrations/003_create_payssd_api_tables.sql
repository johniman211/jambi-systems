-- PaySSD API Tables Migration
-- Creates tables for API payments, API keys, merchants, and webhooks

-- 1) Merchants table (businesses using the API)
CREATE TABLE IF NOT EXISTS payssd_merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  mtn_momo_number text,
  bank_account_info jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2) API Keys table
CREATE TABLE IF NOT EXISTS payssd_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES payssd_merchants(id) ON DELETE CASCADE,
  key_prefix text NOT NULL, -- First 8 chars for identification (e.g., "sk_live_")
  key_hash text NOT NULL, -- SHA256 hash of the full key
  name text NOT NULL DEFAULT 'Default',
  is_live boolean NOT NULL DEFAULT false, -- false = test mode, true = live mode
  is_active boolean NOT NULL DEFAULT true,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3) Payments table (API-created payments)
CREATE TABLE IF NOT EXISTS payssd_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES payssd_merchants(id) ON DELETE CASCADE,
  reference_code text UNIQUE NOT NULL, -- 10-digit reference code
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'SSP',
  status text NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'matched', 'confirmed', 'rejected', 'expired')),
  payment_method text NOT NULL DEFAULT 'mtn_momo'
    CHECK (payment_method IN ('mtn_momo', 'bank_transfer')),
  customer_phone text NOT NULL,
  customer_email text,
  description text,
  external_id text, -- Merchant's internal reference
  metadata jsonb DEFAULT '{}',
  transaction_id text, -- External transaction ID from payment provider
  proof_url text, -- URL to payment proof image
  source text NOT NULL DEFAULT 'api' CHECK (source IN ('api', 'dashboard', 'checkout')),
  expires_at timestamptz NOT NULL,
  matched_at timestamptz,
  confirmed_at timestamptz,
  rejected_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4) Webhook endpoints table
CREATE TABLE IF NOT EXISTS payssd_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES payssd_merchants(id) ON DELETE CASCADE,
  url text NOT NULL,
  secret text NOT NULL, -- Webhook signing secret
  events text[] NOT NULL DEFAULT ARRAY['payment.created', 'payment.confirmed', 'payment.rejected', 'payment.expired'],
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5) Webhook delivery logs
CREATE TABLE IF NOT EXISTS payssd_webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id uuid NOT NULL REFERENCES payssd_webhooks(id) ON DELETE CASCADE,
  payment_id uuid REFERENCES payssd_payments(id) ON DELETE SET NULL,
  event text NOT NULL,
  payload jsonb NOT NULL,
  response_status int,
  response_body text,
  attempts int NOT NULL DEFAULT 1,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payssd_merchants_user ON payssd_merchants(user_id);
CREATE INDEX IF NOT EXISTS idx_payssd_api_keys_merchant ON payssd_api_keys(merchant_id);
CREATE INDEX IF NOT EXISTS idx_payssd_api_keys_prefix ON payssd_api_keys(key_prefix);
CREATE INDEX IF NOT EXISTS idx_payssd_payments_merchant ON payssd_payments(merchant_id);
CREATE INDEX IF NOT EXISTS idx_payssd_payments_reference ON payssd_payments(reference_code);
CREATE INDEX IF NOT EXISTS idx_payssd_payments_external_id ON payssd_payments(external_id);
CREATE INDEX IF NOT EXISTS idx_payssd_payments_status ON payssd_payments(status);
CREATE INDEX IF NOT EXISTS idx_payssd_payments_customer_phone ON payssd_payments(customer_phone);
CREATE INDEX IF NOT EXISTS idx_payssd_payments_created ON payssd_payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payssd_webhooks_merchant ON payssd_webhooks(merchant_id);
CREATE INDEX IF NOT EXISTS idx_payssd_webhook_logs_webhook ON payssd_webhook_logs(webhook_id);
CREATE INDEX IF NOT EXISTS idx_payssd_webhook_logs_payment ON payssd_webhook_logs(payment_id);

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_payssd_merchants_updated_at ON payssd_merchants;
CREATE TRIGGER update_payssd_merchants_updated_at
  BEFORE UPDATE ON payssd_merchants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payssd_payments_updated_at ON payssd_payments;
CREATE TRIGGER update_payssd_payments_updated_at
  BEFORE UPDATE ON payssd_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payssd_webhooks_updated_at ON payssd_webhooks;
CREATE TRIGGER update_payssd_webhooks_updated_at
  BEFORE UPDATE ON payssd_webhooks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE payssd_merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE payssd_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE payssd_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payssd_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE payssd_webhook_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Merchants: Users can only see their own merchant profile
CREATE POLICY "Users can view own merchant"
  ON payssd_merchants FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own merchant"
  ON payssd_merchants FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- API Keys: Only merchant owners can manage their keys
CREATE POLICY "Merchants can view own API keys"
  ON payssd_api_keys FOR SELECT
  TO authenticated
  USING (merchant_id IN (SELECT id FROM payssd_merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants can manage own API keys"
  ON payssd_api_keys FOR ALL
  TO authenticated
  USING (merchant_id IN (SELECT id FROM payssd_merchants WHERE user_id = auth.uid()));

-- Payments: Merchants can only see their own payments
CREATE POLICY "Merchants can view own payments"
  ON payssd_payments FOR SELECT
  TO authenticated
  USING (merchant_id IN (SELECT id FROM payssd_merchants WHERE user_id = auth.uid()));

CREATE POLICY "Merchants can manage own payments"
  ON payssd_payments FOR ALL
  TO authenticated
  USING (merchant_id IN (SELECT id FROM payssd_merchants WHERE user_id = auth.uid()));

-- Service role can manage all (for API operations)
CREATE POLICY "Service can manage all payments"
  ON payssd_payments FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service can manage all API keys"
  ON payssd_api_keys FOR ALL
  USING (true)
  WITH CHECK (true);

-- Webhooks: Merchants can manage their own webhooks
CREATE POLICY "Merchants can manage own webhooks"
  ON payssd_webhooks FOR ALL
  TO authenticated
  USING (merchant_id IN (SELECT id FROM payssd_merchants WHERE user_id = auth.uid()));

CREATE POLICY "Service can manage all webhooks"
  ON payssd_webhooks FOR ALL
  USING (true)
  WITH CHECK (true);

-- Webhook logs: Merchants can view their own logs
CREATE POLICY "Merchants can view own webhook logs"
  ON payssd_webhook_logs FOR SELECT
  TO authenticated
  USING (webhook_id IN (
    SELECT id FROM payssd_webhooks 
    WHERE merchant_id IN (SELECT id FROM payssd_merchants WHERE user_id = auth.uid())
  ));

CREATE POLICY "Service can manage all webhook logs"
  ON payssd_webhook_logs FOR ALL
  USING (true)
  WITH CHECK (true);
