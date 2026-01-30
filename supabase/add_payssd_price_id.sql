-- Add payssd_price_id column to store_products table
ALTER TABLE store_products 
ADD COLUMN IF NOT EXISTS payssd_price_id TEXT;

-- Comment for documentation
COMMENT ON COLUMN store_products.payssd_price_id IS 'PaySSD price ID from dashboard for payment integration';
