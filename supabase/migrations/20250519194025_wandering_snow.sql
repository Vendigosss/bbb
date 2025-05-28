/*
  # Fix Products Insert Policy

  1. Changes
    - Drop and recreate the INSERT policy for products table to ensure it works correctly
    - The policy will allow authenticated users to create products where they are the seller

  2. Security
    - Maintains RLS enabled on products table
    - Ensures users can only create products where they are the seller
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Authenticated users can create products" ON products;

-- Create the corrected policy
CREATE POLICY "Authenticated users can create products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = seller_id
);