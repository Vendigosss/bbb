import { supabase } from './auth';

export const reportService = {
  async createReport(productId: string, reason: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('reports')
      .insert({
        reporter_id: user.id,
        product_id: productId,
        reason
      });

    if (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Вы уже отправляли жалобу на это объявление');
      }
      console.error('Error creating report:', error);
      throw error;
    }

    return true;
  }
};