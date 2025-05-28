/*
  # Fix products table foreign key relationship

  1. Changes
    - Add foreign key relationship between products.seller_id and profiles.id
    - Update the join query in the products service
*/

-- First, ensure all existing products have valid seller_ids that exist in profiles
DELETE FROM products WHERE seller_id NOT IN (SELECT id FROM profiles);

-- Add foreign key constraint
ALTER TABLE products 
DROP CONSTRAINT IF EXISTS products_seller_id_fkey;

ALTER TABLE products
ADD CONSTRAINT products_seller_id_fkey 
FOREIGN KEY (seller_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;