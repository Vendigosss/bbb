/*
  # Update products table RLS policies

  1. Changes
    - Drop existing SELECT policy that allows public access
    - Create new SELECT policy that only allows authenticated users to view products
    - Maintain other existing policies (INSERT, UPDATE, DELETE)

  2. Security
    - Only authenticated users can view products
    - Maintains existing security for other operations
*/

-- Drop the existing public SELECT policy
DROP POLICY IF EXISTS "Everyone can view active products" ON products;

-- Create new SELECT policy for authenticated users only
CREATE POLICY "Only authenticated users can view products"
ON products
FOR SELECT
TO authenticated
USING (status = 'active');