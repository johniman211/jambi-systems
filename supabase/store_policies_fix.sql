-- Run this to fix existing policies (drop and recreate)

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view published products" ON store_products;
DROP POLICY IF EXISTS "Admins can manage all products" ON store_products;
DROP POLICY IF EXISTS "Public can create orders" ON store_orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON store_orders;
DROP POLICY IF EXISTS "Admins can view license keys" ON store_license_keys;
DROP POLICY IF EXISTS "Service can insert license keys" ON store_license_keys;
DROP POLICY IF EXISTS "Admins can manage deploy requests" ON store_deploy_requests;
DROP POLICY IF EXISTS "Service can insert deploy requests" ON store_deploy_requests;

-- Recreate policies

-- store_products policies
CREATE POLICY "Public can view published products"
  ON store_products FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage all products"
  ON store_products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- store_orders policies
CREATE POLICY "Public can create orders"
  ON store_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage all orders"
  ON store_orders FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- store_license_keys policies
CREATE POLICY "Admins can view license keys"
  ON store_license_keys FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service can insert license keys"
  ON store_license_keys FOR INSERT
  WITH CHECK (true);

-- store_deploy_requests policies
CREATE POLICY "Admins can manage deploy requests"
  ON store_deploy_requests FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service can insert deploy requests"
  ON store_deploy_requests FOR INSERT
  WITH CHECK (true);
