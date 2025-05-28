import { supabase } from './auth';
import { Product } from '../types';

export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        profiles!products_seller_id_fkey (
          id,
          name,
          avatar_url,
          avg_rating,
          total_ratings
        ),
        categories!products_category_id_fkey (
          id,
          name,
          slug
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.categories.name,
      categorySlug: product.categories.slug,
      images: product.images,
      seller_id: product.seller_id,
      sellerName: product.profiles?.name || 'Аноним',
      sellerAvatar: product.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${product.profiles?.name}`,
      sellerRating: product.profiles?.avg_rating || 0,
      sellerTotalRatings: product.profiles?.total_ratings || 0,
      rating: product.avg_rating || 0,
      reviewCount: product.total_reviews || 0,
      createdAt: product.created_at
    }));
  },

  async getUserProducts(userId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        profiles!products_seller_id_fkey (
          id,
          name,
          avatar_url,
          avg_rating,
          total_ratings
        ),
        categories!products_category_id_fkey (
          id,
          name,
          slug
        )
      `)
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user products:', error);
      return [];
    }

    return data.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.categories.name,
      categorySlug: product.categories.slug,
      images: product.images,
      seller_id: product.seller_id,
      sellerName: product.profiles?.name || 'Аноним',
      sellerAvatar: product.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${product.profiles?.name}`,
      sellerRating: product.profiles?.avg_rating || 0,
      sellerTotalRatings: product.profiles?.total_ratings || 0,
      rating: product.avg_rating || 0,
      reviewCount: product.total_reviews || 0,
      createdAt: product.created_at
    }));
  },

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        profiles!products_seller_id_fkey (
          id,
          name,
          avatar_url,
          avg_rating,
          total_ratings,
          bio
        ),
        categories!products_category_id_fkey (
          id,
          name,
          slug
        ),
        product_reviews (
          id,
          rating,
          review,
          created_at,
          buyer:profiles!product_reviews_buyer_id_fkey (
            name,
            avatar_url
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.categories.name,
      categorySlug: data.categories.slug,
      images: data.images,
      seller_id: data.seller_id,
      sellerName: data.profiles?.name || 'Аноним',
      sellerAvatar: data.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${data.profiles?.name}`,
      sellerRating: data.profiles?.avg_rating || 0,
      sellerTotalRatings: data.profiles?.total_ratings || 0,
      sellerBio: data.profiles?.bio || '',
      rating: data.avg_rating || 0,
      reviewCount: data.total_reviews || 0,
      reviews: data.product_reviews || [],
      createdAt: data.created_at
    };
  },

  async createProduct(data: {
    title: string;
    description: string;
    price: number;
    category_id: string;
    images: string[];
  }): Promise<Product | null> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('User profile not found');
    }

    // Get category details first
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('name')
      .eq('id', data.category_id)
      .single();

    if (categoryError || !category) {
      throw new Error('Category not found');
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        title: data.title,
        description: data.description,
        price: data.price,
        category_id: data.category_id,
        category: category.name,
        images: data.images,
        seller_id: profile.id,
        status: 'active'
      })
      .select(`
        *,
        profiles!products_seller_id_fkey (
          id,
          name,
          avatar_url,
          avg_rating,
          total_ratings
        ),
        categories!products_category_id_fkey (
          id,
          name,
          slug
        )
      `)
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.categories.name,
      categorySlug: product.categories.slug,
      images: product.images,
      seller_id: product.seller_id,
      sellerName: product.profiles?.name || 'Аноним',
      sellerAvatar: product.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${product.profiles?.name}`,
      sellerRating: product.profiles?.avg_rating || 0,
      sellerTotalRatings: product.profiles?.total_ratings || 0,
      rating: product.avg_rating || 0,
      reviewCount: product.total_reviews || 0,
      createdAt: product.created_at
    };
  },

  async updateProduct(id: string, updates: {
    title?: string;
    description?: string;
    price?: number;
    category_id?: string;
    images?: string[];
    status?: 'active' | 'sold' | 'deleted';
  }): Promise<Product | null> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('User profile not found');
    }

    let categoryName;
    if (updates.category_id) {
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('name')
        .eq('id', updates.category_id)
        .single();

      if (categoryError || !category) {
        throw new Error('Category not found');
      }
      categoryName = category.name;
    }

    const { data: product, error } = await supabase
      .from('products')
      .update({
        ...updates,
        category: categoryName,
      })
      .eq('id', id)
      .eq('seller_id', profile.id)
      .select(`
        *,
        profiles!products_seller_id_fkey (
          id,
          name,
          avatar_url,
          avg_rating,
          total_ratings
        ),
        categories!products_category_id_fkey (
          id,
          name,
          slug
        )
      `)
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.categories.name,
      categorySlug: product.categories.slug,
      images: product.images,
      seller_id: product.seller_id,
      sellerName: product.profiles?.name || 'Аноним',
      sellerAvatar: product.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${product.profiles?.name}`,
      sellerRating: product.profiles?.avg_rating || 0,
      sellerTotalRatings: product.profiles?.total_ratings || 0,
      rating: product.avg_rating || 0,
      reviewCount: product.total_reviews || 0,
      createdAt: product.created_at
    };
  },

  async deleteProduct(id: string): Promise<boolean> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('User profile not found');
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('seller_id')
      .eq('id', id)
      .single();

    if (productError || !product) {
      throw new Error('Product not found');
    }

    if (profile.is_admin || product.seller_id === profile.id) {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-product`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: id,
          status: 'deleted'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error deleting product:', error);
        return false;
      }

      return true;
    }

    throw new Error('Unauthorized to delete this product');
  },

  async uploadProductImage(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data;
  }
};