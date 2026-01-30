-- Update store_orders to use Payssd API integration
-- Adds columns for payssd payment tracking and updates status constraint

-- Add new columns for payssd integration
ALTER TABLE store_orders 
  ADD COLUMN IF NOT EXISTS payssd_payment_id uuid,
  ADD COLUMN IF NOT EXISTS payssd_reference_code text;

-- Drop old payssd_checkout_url column if exists
ALTER TABLE store_orders 
  DROP COLUMN IF EXISTS payssd_checkout_url;

-- Update status constraint to include payssd statuses
ALTER TABLE store_orders 
  DROP CONSTRAINT IF EXISTS store_orders_status_check;

ALTER TABLE store_orders 
  ADD CONSTRAINT store_orders_status_check 
  CHECK (status IN ('pending', 'matched', 'confirmed', 'rejected', 'expired', 'paid', 'failed', 'refunded'));

-- Add index for payssd payment lookup
CREATE INDEX IF NOT EXISTS idx_store_orders_payssd_payment ON store_orders(payssd_payment_id);
CREATE INDEX IF NOT EXISTS idx_store_orders_payssd_reference ON store_orders(payssd_reference_code);

-- Add foreign key to payssd_payments (optional - comment out if not needed)
-- ALTER TABLE store_orders 
--   ADD CONSTRAINT fk_store_orders_payssd_payment 
--   FOREIGN KEY (payssd_payment_id) REFERENCES payssd_payments(id) ON DELETE SET NULL;
