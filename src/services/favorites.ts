import { supabase } from './auth';
import type { Product } from '../types';

export const favoritesService = {
  async getFavorites(): Promise<Product[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        product_id,
        products!favorites_product_id_fkey (
          *,
          profiles!products_seller_id_fkey (
            id,
            name,
            avatar_url
          )
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }

    return data.map(favorite => ({
      id: favorite.products.id,
      title: favorite.products.title,
      description: favorite.products.description,
      price: favorite.products.price,
      category: favorite.products.category,
      images: favorite.products.images,
      seller_id: favorite.products.seller_id,
      sellerName: favorite.products.profiles?.name || 'Аноним',
      sellerAvatar: favorite.products.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${favorite.products.profiles?.name}`,
      rating: 0,
      reviewCount: 0,
      createdAt: favorite.products.created_at
    }));
  },

  async addToFavorites(productId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // First check if the favorite already exists
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    // If it already exists, return true as it's already in favorites
    if (existingFavorite) {
      return true;
    }

    // If it doesn't exist, insert it
    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        product_id: productId
      });

    if (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }

    return true;
  },

  async removeFromFavorites(productId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }

    return true;
  },

  async isFavorite(productId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .limit(1);

    if (error) {
      console.error('Error checking if favorite:', error);
      return false;
    }

    return data !== null && data.length > 0;
  }
};