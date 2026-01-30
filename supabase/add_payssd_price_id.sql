-- Add payssd_checkout_url column to store_products table
ALTER TABLE store_products 
ADD COLUMN IF NOT EXISTS payssd_checkout_url TEXT;

-- Comment for documentation
COMMENT ON COLUMN store_products.payssd_checkout_url IS 'PaySSD Payment Link URL from dashboard for payment integration';
