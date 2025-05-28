import { supabase } from './auth';
import type { Profile } from './profile';

export interface Conversation {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
  product: {
    id: string;
    title: string;
    images: string[];
  };
  buyer: Profile;
  seller: Profile;
  last_message?: Message;
  unread_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export const chatService = {
  async getConversations(): Promise<Conversation[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        product:products!conversations_product_id_fkey (
          id,
          title,
          images
        ),
        buyer:profiles!conversations_buyer_id_fkey (
          id,
          name,
          avatar_url
        ),
        seller:profiles!conversations_seller_id_fkey (
          id,
          name,
          avatar_url
        ),
        messages:messages (
          id,
          content,
          created_at,
          read_at,
          sender_id
        )
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }

    return data.map(conv => ({
      ...conv,
      last_message: conv.messages[conv.messages.length - 1],
      unread_count: conv.messages.filter(
        (m: Message) => m.sender_id !== user.id && !m.read_at
      ).length
    }));
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data;
  },

  async sendMessage(conversationId: string, content: string): Promise<Message | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    // Update conversation's last_message_at
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    return data;
  },

  async markAsRead(conversationId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .is('read_at', null);

    if (error) {
      console.error('Error marking messages as read:', error);
    }
  },

  async startConversation(productId: string, sellerId: string): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id === sellerId) return null;

    // Check if conversation already exists
    const { data: existingConv } = await supabase
      .from('conversations')
      .select('id')
      .eq('product_id', productId)
      .eq('buyer_id', user.id)
      .eq('seller_id', sellerId)
      .single();

    if (existingConv) {
      return existingConv.id;
    }

    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        product_id: productId,
        buyer_id: user.id,
        seller_id: sellerId
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting conversation:', error);
      return null;
    }

    return data.id;
  }
};