-- Store Tables Migration
-- Run this migration to create all store-related tables

-- 1) store_products table
CREATE TABLE IF NOT EXISTS store_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  summary text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  base_price_cents int NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  multi_use_price_cents int NOT NULL DEFAULT 0,
  deploy_addon_price_cents int NOT NULL DEFAULT 0,
  demo_url text NULL,
  cover_image_path text NULL,
  gallery_image_paths text[] NULL,
  deliverable_path text NULL,
  whats_included text[] NULL,
  requirements text[] NULL,
  support_info text NULL,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2) store_orders table
CREATE TABLE IF NOT EXISTS store_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES store_products(id) ON DELETE SET NULL,
  buyer_name text NULL,
  buyer_phone text NOT NULL,
  buyer_email text NULL,
  license_type text NOT NULL DEFAULT 'single' CHECK (license_type IN ('single', 'multi')),
  delivery_type text NOT NULL DEFAULT 'download' CHECK (delivery_type IN ('download', 'deploy', 'both')),
  amount_cents int NOT NULL,
  currency text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_provider text NOT NULL DEFAULT 'payssd',
  provider_reference text NULL,
  order_access_token text UNIQUE NOT NULL,
  paid_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3) store_license_keys table
CREATE TABLE IF NOT EXISTS store_license_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES store_orders(id) ON DELETE CASCADE,
  license_key text UNIQUE NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now()
);

-- 4) store_deploy_requests table
CREATE TABLE IF NOT EXISTS store_deploy_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES store_orders(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'done')),
  notes text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_store_products_slug ON store_products(slug);
CREATE INDEX IF NOT EXISTS idx_store_products_category ON store_products(category);
CREATE INDEX IF NOT EXISTS idx_store_products_published ON store_products(is_published);
CREATE INDEX IF NOT EXISTS idx_store_orders_product ON store_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_store_orders_status ON store_orders(status);
CREATE INDEX IF NOT EXISTS idx_store_orders_token ON store_orders(order_access_token);
CREATE INDEX IF NOT EXISTS idx_store_license_keys_order ON store_license_keys(order_id);
CREATE INDEX IF NOT EXISTS idx_store_deploy_requests_order ON store_deploy_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_store_deploy_requests_status ON store_deploy_requests(status);

-- Updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_store_products_updated_at ON store_products;
CREATE TRIGGER update_store_products_updated_at
  BEFORE UPDATE ON store_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_store_deploy_requests_updated_at ON store_deploy_requests;
CREATE TRIGGER update_store_deploy_requests_updated_at
  BEFORE UPDATE ON store_deploy_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies

-- Enable RLS on all tables
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_license_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_deploy_requests ENABLE ROW LEVEL SECURITY;

-- store_products policies
-- Public can read published products
CREATE POLICY "Public can view published products"
  ON store_products FOR SELECT
  USING (is_published = true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admins can manage all products"
  ON store_products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- store_orders policies
-- Public can insert orders (create order at checkout)
CREATE POLICY "Public can create orders"
  ON store_orders FOR INSERT
  WITH CHECK (true);

-- Authenticated users (admin) can view and update all orders
CREATE POLICY "Admins can manage all orders"
  ON store_orders FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- store_license_keys policies
-- Only authenticated (admin) can view license keys
CREATE POLICY "Admins can view license keys"
  ON store_license_keys FOR SELECT
  TO authenticated
  USING (true);

-- Service role can insert license keys (via webhook)
CREATE POLICY "Service can insert license keys"
  ON store_license_keys FOR INSERT
  WITH CHECK (true);

-- store_deploy_requests policies
-- Only authenticated (admin) can view and manage deploy requests
CREATE POLICY "Admins can manage deploy requests"
  ON store_deploy_requests FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Service role can insert deploy requests (via webhook)
CREATE POLICY "Service can insert deploy requests"
  ON store_deploy_requests FOR INSERT
  WITH CHECK (true);
