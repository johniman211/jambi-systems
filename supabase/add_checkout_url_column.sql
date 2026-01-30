-- Add payssd_checkout_url column to store_orders table
ALTER TABLE store_orders 
ADD COLUMN IF NOT EXISTS payssd_checkout_url TEXT;

-- Optional: Add comment for documentation
COMMENT ON COLUMN store_orders.payssd_checkout_url IS 'PaySSD checkout URL for pending payments';
