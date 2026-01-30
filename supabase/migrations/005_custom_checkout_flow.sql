-- Custom Checkout Flow Migration
-- Adds order_code to store_orders and creates payment_confirmations table

-- 1) Add order_code column to store_orders
ALTER TABLE store_orders 
  ADD COLUMN IF NOT EXISTS order_code text UNIQUE;

-- 2) Update status constraint to include new statuses
ALTER TABLE store_orders 
  DROP CONSTRAINT IF EXISTS store_orders_status_check;

ALTER TABLE store_orders 
  ADD CONSTRAINT store_orders_status_check 
  CHECK (status IN ('pending', 'pending_verification', 'paid', 'confirmed', 'rejected', 'expired', 'failed', 'refunded'));

-- 3) Create payment_confirmations table
CREATE TABLE IF NOT EXISTS store_payment_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES store_orders(id) ON DELETE CASCADE NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('momo', 'equity')),
  payer_phone text,
  transaction_reference text NOT NULL,
  amount_cents int NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  receipt_path text,
  note text,
  auto_approved boolean NOT NULL DEFAULT false,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  review_status text NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4) Create indexes
CREATE INDEX IF NOT EXISTS idx_store_orders_order_code ON store_orders(order_code);
CREATE INDEX IF NOT EXISTS idx_payment_confirmations_order ON store_payment_confirmations(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_confirmations_status ON store_payment_confirmations(review_status);

-- 5) Enable RLS on payment_confirmations
ALTER TABLE store_payment_confirmations ENABLE ROW LEVEL SECURITY;

-- 6) RLS Policies for payment_confirmations
-- Drop existing policies first
DROP POLICY IF EXISTS "Public can insert payment confirmations" ON store_payment_confirmations;
DROP POLICY IF EXISTS "Service can manage all confirmations" ON store_payment_confirmations;

-- Public can only insert (submit confirmations)
CREATE POLICY "Public can insert payment confirmations"
  ON store_payment_confirmations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Service role can do everything (for server actions)
CREATE POLICY "Service can manage all confirmations"
  ON store_payment_confirmations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 7) Create storage bucket for payment proofs (run manually in Supabase dashboard if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('store-proofs', 'store-proofs', false)
-- ON CONFLICT (id) DO NOTHING;

-- 8) Generate order_code for existing orders that don't have one
UPDATE store_orders 
SET order_code = 'JS-' || LPAD(FLOOR(RANDOM() * 100000)::text, 5, '0')
WHERE order_code IS NULL;

-- 9) Make order_code NOT NULL after populating existing rows
-- Note: Run this after confirming all existing orders have codes
-- ALTER TABLE store_orders ALTER COLUMN order_code SET NOT NULL;
