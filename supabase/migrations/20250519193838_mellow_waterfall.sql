/*
  # Fix product creation RLS policy

  1. Changes
    - Drop existing product creation policy
    - Create new policy for authenticated users to create products
    - Policy ensures seller_id matches the authenticated user's ID
*/

DROP POLICY IF EXISTS "Authenticated users can create products" ON products;

CREATE POLICY "Authenticated users can create products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = seller_id);