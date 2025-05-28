import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { supabase } from '../services/auth';
import { useAuth } from '../context/AuthContext';

interface Props {
  isSelf?: boolean;
}

const SellerProfilePage: React.FC<Props> = ({ isSelf }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const sellerId = isSelf ? user?.id : id;

  const [seller, setSeller] = useState<any>(null);
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sellerId) loadSeller();
  }, [sellerId]);

  const loadSeller = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sellerId)
        .single();

      const { data: reviews } = await supabase
        .from('seller_ratings')
        .select('rating, comment')
        .eq('seller_id', sellerId);

      setSeller(profile);
      setRatings(reviews || []);
    } catch (error) {
      console.error('Ошибка загрузки профиля продавца:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Загрузка...</div>;
  if (!seller) return <div className="text-center py-8">Профиль не найден</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center space-x-4">
        <img
          src={seller.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${seller.name}`}
          alt="avatar"
          className="w-16 h-16 rounded-full border"
        />
        <div>
          <h2 className="text-2xl font-semibold">{seller.name || 'Без имени'}</h2>
          <p className="text-sm text-gray-500">{seller.location || 'Город не указан'}</p>
          <p className="text-sm text-gray-600 mt-1">
            Средний рейтинг: {seller.avg_rating || 0} ({seller.total_ratings || 0} оценок)
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Отзывы покупателей</h3>
        {ratings.length === 0 ? (
          <p className="text-sm text-gray-500">Пока нет отзывов.</p>
        ) : (
          <ul className="space-y-4">
            {ratings.map((r, index) => (
              <li key={index} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= r.rating ? 'text-amber-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-700">{r.comment || 'Без комментария'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SellerProfilePage;
