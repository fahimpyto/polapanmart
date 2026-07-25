-- PolapanMart Database Schema

-- Categories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price TEXT NOT NULL,
  image_url TEXT,
  affiliate_link TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Click tracking
CREATE TABLE clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT now(),
  referrer TEXT,
  user_agent TEXT
);

-- Function to increment click count
CREATE OR REPLACE FUNCTION increment_click(p_product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products SET click_count = click_count + 1 WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(active) WHERE active = true;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

-- RLS: Public read for products and categories
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (active = true);

CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- RLS: Authenticated admin can do everything
CREATE POLICY "Admin can manage products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can manage clicks"
  ON clicks FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert a sample category
INSERT INTO categories (name, slug, sort_order) VALUES ('Home', 'home', 1);
INSERT INTO categories (name, slug, sort_order) VALUES ('Fashion', 'fashion', 2);
INSERT INTO categories (name, slug, sort_order) VALUES ('Electronics', 'electronics', 3);

-- Migration helper (run if sort_order column is missing):
-- ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 1;

-- Migration helper (run if price column is still DECIMAL):
-- ALTER TABLE products ALTER COLUMN price TYPE TEXT;
