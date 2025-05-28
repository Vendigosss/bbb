/*
  # Create products table and security policies

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `title` (text) - Product title
      - `description` (text) - Product description
      - `price` (decimal) - Product price
      - `category` (text) - Product category
      - `images` (text[]) - Array of image URLs
      - `seller_id` (uuid) - References auth.users
      - `created_at` (timestamptz) - When the product was created
      - `updated_at` (timestamptz) - When the product was last updated
      - `status` (text) - Product status (active, sold, deleted)

  2. Security
    - Enable RLS on `products` table
    - Add policies for:
      - Everyone can view active products
      - Authenticated users can create products
      - Users can update/delete their own products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'deleted'))
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view active products"
  ON products
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Authenticated users can create products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();