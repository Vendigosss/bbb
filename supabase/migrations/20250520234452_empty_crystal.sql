/*
  # Add orders, ratings and reviews functionality
  
  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `buyer_id` (uuid) - References profiles(id)
      - `product_id` (uuid) - References products(id)
      - `seller_id` (uuid) - References profiles(id)
      - `status` (text) - Order status (pending, completed, cancelled)
      - `total_amount` (decimal)
      - `created_at` (timestamptz)
      - `completed_at` (timestamptz)

    - `seller_ratings`
      - `id` (uuid, primary key)
      - `order_id` (uuid) - References orders(id)
      - `seller_id` (uuid) - References profiles(id)
      - `buyer_id` (uuid) - References profiles(id)
      - `rating` (integer) - 1-5 stars
      - `comment` (text)
      - `created_at` (timestamptz)

    - `product_reviews`
      - `id` (uuid, primary key)
      - `order_id` (uuid) - References orders(id)
      - `product_id` (uuid) - References products(id)
      - `buyer_id` (uuid) - References profiles(id)
      - `rating` (integer) - 1-5 stars
      - `review` (text)
      - `created_at` (timestamptz)

  2. Add columns to profiles table for seller ratings
    - `avg_rating` (decimal)
    - `total_ratings` (integer)

  3. Add columns to products table for product ratings
    - `avg_rating` (decimal)
    - `total_reviews` (integer)

  4. Security
    - Enable RLS on all new tables
    - Add appropriate policies
*/

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  total_amount decimal(10,2) NOT NULL CHECK (total_amount >= 0),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(product_id, buyer_id)
);

-- Create seller_ratings table
CREATE TABLE IF NOT EXISTS seller_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(order_id)
);

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  buyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(order_id)
);

-- Add rating columns to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS avg_rating decimal(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_ratings integer DEFAULT 0;

-- Add rating columns to products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS avg_rating decimal(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0;

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = buyer_id OR 
    auth.uid() = seller_id
  );

CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

-- Seller ratings policies
CREATE POLICY "Everyone can view seller ratings"
  ON seller_ratings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Buyers can rate sellers once per order"
  ON seller_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id AND
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
      AND orders.buyer_id = auth.uid()
      AND orders.status = 'completed'
    )
  );

-- Product reviews policies
CREATE POLICY "Everyone can view product reviews"
  ON product_reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Buyers can review products once per order"
  ON product_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id AND
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
      AND orders.buyer_id = auth.uid()
      AND orders.status = 'completed'
    )
  );

-- Create function to update seller ratings
CREATE OR REPLACE FUNCTION update_seller_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    avg_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM seller_ratings
      WHERE seller_id = NEW.seller_id
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM seller_ratings
      WHERE seller_id = NEW.seller_id
    )
  WHERE id = NEW.seller_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update product ratings
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET 
    avg_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM product_reviews
      WHERE product_id = NEW.product_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM product_reviews
      WHERE product_id = NEW.product_id
    )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for rating updates
CREATE TRIGGER update_seller_rating_trigger
  AFTER INSERT OR UPDATE ON seller_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_seller_rating();

CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE ON product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();