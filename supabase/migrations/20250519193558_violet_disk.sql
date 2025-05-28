/*
  # Storage setup for product images
  
  1. Creates a new storage bucket for product images
  2. Makes the bucket publicly accessible
  3. Sets up RLS policies for:
    - Public read access
    - Authenticated user upload
    - Product image management
*/

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'Product images storage', true)
ON CONFLICT (id) DO NOTHING;

-- Create security policies
DO $$
BEGIN
  -- Public read access for product images
  CREATE POLICY "Public read access for product images"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'products' );

  -- Allow authenticated users to upload product images
  CREATE POLICY "Users can upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'products'
      AND (storage.foldername(name))[1] = 'products'
    );

  -- Allow users to update their product images
  CREATE POLICY "Users can update own product images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'products'
      AND EXISTS (
        SELECT 1 FROM products
        WHERE seller_id = auth.uid()
        AND images::text[] @> ARRAY[storage.foldername(name)]
      )
    );

  -- Allow users to delete their product images
  CREATE POLICY "Users can delete own product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'products'
      AND EXISTS (
        SELECT 1 FROM products
        WHERE seller_id = auth.uid()
        AND images::text[] @> ARRAY[storage.foldername(name)]
      )
    );
END $$;