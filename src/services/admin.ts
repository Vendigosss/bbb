import { supabase } from './auth';

export const adminService = {
  async getUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return data;
  },

  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        seller:profiles!products_seller_id_fkey (
          id,
          name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data;
  },

  async getReports() {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        product:products (
          id,
          title,
          images
        ),
        reporter:profiles!reports_reporter_id_fkey (
          id,
          name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      return [];
    }

    return data;
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data;
  },

  async updateUserStatus(userId: string, action: 'suspend' | 'ban' | 'activate') {
    const status = action === 'activate' ? 'active' :
                  action === 'suspend' ? 'suspended' : 'banned';

    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', userId);

    if (error) throw error;
  },

  async updateProductStatus(productId: string, action: 'delete' | 'restore') {
  const status = action === 'delete' ? 'deleted' : 'active';

  const { error } = await supabase
    .from('products')
    .update({ status: 'deleted' })
    .eq('id', productId);

  if (error) throw error;

  return { success: true };
},

  async updateReportStatus(reportId: string, action: 'resolve' | 'dismiss') {
    const status = action === 'resolve' ? 'resolved' : 'dismissed';

    const { error } = await supabase
      .from('reports')
      .update({
        status,
        resolved_at: new Date().toISOString()
      })
      .eq('id', reportId);

    if (error) throw error;
  },

  async createCategory(data: { name: string; slug: string; description?: string }) {
    const { error } = await supabase
      .from('categories')
      .insert(data);

    if (error) throw error;
  },

  async updateCategory(categoryId: string, data: { name: string; description?: string }) {
    const { error } = await supabase
      .from('categories')
      .update({
        name: data.name,
        description: data.description,
        slug: data.name.toLowerCase().replace(/\s+/g, '-')
      })
      .eq('id', categoryId);

    if (error) throw error;
  },

  async deleteCategory(categoryId: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) throw error;
  }
};