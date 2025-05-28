/*
  # Add categories and update products table
  
  1. Changes
    - Create categories table with initial data
    - Add category_id to products table
    - Migrate existing category data
    - Update constraints
*/

-- Add categories
INSERT INTO categories (name, slug, description) VALUES
  ('Electronics', 'electronics', 'Gadgets, computers, smartphones and other electronic devices'),
  ('Fashion', 'fashion', 'Clothing, shoes, accessories and jewelry'),
  ('Home & Garden', 'home-garden', 'Furniture, decor, gardening tools and home improvement'),
  ('Sports & Outdoors', 'sports-outdoors', 'Sports equipment, outdoor gear and fitness accessories'),
  ('Books & Media', 'books-media', 'Books, movies, music and educational materials'),
  ('Collectibles', 'collectibles', 'Rare items, antiques, art and memorabilia'),
  ('Automotive', 'automotive', 'Cars, parts, tools and accessories'),
  ('Toys & Games', 'toys-games', 'Board games, toys, video games and entertainment'),
  ('Health & Beauty', 'health-beauty', 'Personal care, cosmetics and wellness products'),
  ('Pet Supplies', 'pet-supplies', 'Food, accessories and care items for pets'),
  ('Other', 'other', 'Miscellaneous items that don''t fit other categories');

-- Add category_id column (nullable at first)
ALTER TABLE products 
ADD COLUMN category_id uuid REFERENCES categories(id);

-- Create a function to get or create category
CREATE OR REPLACE FUNCTION get_or_create_category(p_name text)
RETURNS uuid AS $$
DECLARE
  v_category_id uuid;
BEGIN
  -- Try to find existing category
  SELECT id INTO v_category_id
  FROM categories
  WHERE name ILIKE p_name;
  
  -- If not found, use 'Other' category
  IF v_category_id IS NULL THEN
    SELECT id INTO v_category_id
    FROM categories
    WHERE slug = 'other';
  END IF;
  
  RETURN v_category_id;
END;
$$ LANGUAGE plpgsql;

-- Update existing products to reference categories
UPDATE products
SET category_id = get_or_create_category(category);

-- Now make category_id required
ALTER TABLE products
ALTER COLUMN category_id SET NOT NULL;

-- Drop the temporary function
DROP FUNCTION get_or_create_category(text);