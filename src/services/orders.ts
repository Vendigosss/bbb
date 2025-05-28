import { supabase } from './auth';
import type { Order, SellerRating, ProductReview } from '../types';

export const orderService = {
  async createOrder(productId: string, totalAmount: number): Promise<Order | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get the product seller
    const { data: product } = await supabase
      .from('products')
      .select('seller_id')
      .eq('id', productId)
      .single();

    if (!product) return null;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        buyer_id: user.id,
        product_id: productId,
        seller_id: product.seller_id,
        total_amount: totalAmount
      })
      .select(`
        *,
        product:products (
          title,
          images
        ),
        seller:profiles!orders_seller_id_fkey (
          name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return null;
    }

    return data;
  },

  async getOrders(): Promise<Order[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        product:products (
          title,
          images
        ),
        seller:profiles!orders_seller_id_fkey (
          name,
          avatar_url
        ),
        seller_rating:seller_ratings (
          rating,
          comment
        ),
        product_review:product_reviews (
          rating,
          review
        )
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data;
  },

  async completeOrder(orderId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // First, verify that the user is the seller of this order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('seller_id, product_id')
      .eq('id', orderId)
      .single();

    if (orderError || !order || order.seller_id !== user.id) {
      console.error('Error verifying order ownership:', orderError);
      return false;
    }

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('seller_id', user.id);

    if (updateError) {
      console.error('Error completing order:', updateError);
      return false;
    }

    // Update product status to sold
    const { error: productError } = await supabase
      .from('products')
      .update({ status: 'sold' })
      .eq('id', order.product_id);

    if (productError) {
      console.error('Error updating product status:', productError);
      // Don't return false here as the order is already completed
    }

    return true;
  },

  async rateSellerAndProduct(
    orderId: string,
    sellerRating: { rating: number; comment?: string },
    productReview: { rating: number; review?: string }
  ): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Get order details
    const { data: order } = await supabase
      .from('orders')
      .select('product_id, seller_id')
      .eq('id', orderId)
      .eq('buyer_id', user.id)
      .single();

    if (!order) return false;

    // Start a batch of operations
    const promises = [];

    // Add seller rating
    promises.push(
      supabase
        .from('seller_ratings')
        .insert({
          order_id: orderId,
          seller_id: order.seller_id,
          buyer_id: user.id,
          rating: sellerRating.rating,
          comment: sellerRating.comment
        })
    );

    // Add product review
    promises.push(
      supabase
        .from('product_reviews')
        .insert({
          order_id: orderId,
          product_id: order.product_id,
          buyer_id: user.id,
          rating: productReview.rating,
          review: productReview.review
        })
    );

    try {
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Error rating seller and product:', error);
      return false;
    }
  }
};