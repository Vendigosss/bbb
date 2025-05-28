import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Star, Package, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orders';
import type { Order } from '../types';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [ratingData, setRatingData] = useState({
    sellerRating: 5,
    sellerComment: '',
    productRating: 5,
    productReview: ''
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      const success = await orderService.completeOrder(orderId);
      if (success) {
        toast.success('Заказ завершен');
        loadOrders();
      }
    } catch (error) {
      console.error('Error completing order:', error);
      toast.error('Не удалось завершить заказ');
    }
  };

  const handleSubmitRating = async () => {
    if (!selectedOrder) return;

    try {
      const success = await orderService.rateSellerAndProduct(
        selectedOrder.id,
        {
          rating: ratingData.sellerRating,
          comment: ratingData.sellerComment
        },
        {
          rating: ratingData.productRating,
          review: ratingData.productReview
        }
      );

      if (success) {
        toast.success('Отзыв успешно добавлен');
        setSelectedOrder(null);
        loadOrders();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Не удалось добавить отзыв');
    }
  };

  const StarRating = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className={`text-2xl ${star <= value ? 'text-amber-400' : 'text-gray-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/profile" className="text-teal-600 hover:text-teal-800 flex items-center">
          <ChevronLeft size={18} /> Назад в профиль
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">История заказов</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-800 mb-2">У вас пока нет заказов</h2>
          <p className="text-gray-600 mb-6">Начните покупать товары на нашей платформе</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Перейти к товарам
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={order.product.images[0]}
                      alt={order.product.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{order.product.title}</h3>
                      <p className="text-sm text-gray-500">
                        Продавец: {order.seller.name || 'Аноним'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Дата: {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₽{order.total_amount}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status === 'completed' ? 'Завершен' :
                       order.status === 'cancelled' ? 'Отменен' :
                       'В обработке'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end space-x-4">
                  {user?.id === order.seller_id && order.status === 'pending' && (
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <Check size={18} className="mr-2" />
                      Завершить заказ
                    </button>
                  )}

                  {user?.id === order.buyer_id && 
                   order.status === 'completed' && 
                   !order.seller_rating && 
                   !order.product_review && (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                    >
                      <Star size={18} className="mr-2" />
                      Оставить отзыв
                    </button>
                  )}
                </div>

                {/* Existing ratings */}
                {(order.seller_rating?.[0] || order.product_review?.[0]) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      {order.seller_rating?.[0] && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Оценка продавца</h4>
                          <div className="flex items-center mb-1">
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  fill={i < order.seller_rating![0].rating ? 'currentColor' : 'none'}
                                />
                              ))}
                            </div>
                          </div>
                          {order.seller_rating[0].comment && (
                            <p className="text-sm text-gray-600">{order.seller_rating[0].comment}</p>
                          )}
                        </div>
                      )}

                      {order.product_review?.[0] && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Отзыв о товаре</h4>
                          <div className="flex items-center mb-1">
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  fill={i < order.product_review![0].rating ? 'currentColor' : 'none'}
                                />
                              ))}
                            </div>
                          </div>
                          {order.product_review[0].review && (
                            <p className="text-sm text-gray-600">{order.product_review[0].review}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Оставить отзыв</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Seller Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Оценка продавца
                </label>
                <StarRating
                  value={ratingData.sellerRating}
                  onChange={(value) => setRatingData(prev => ({ ...prev, sellerRating: value }))}
                />
                <textarea
                  placeholder="Комментарий о продавце (необязательно)"
                  value={ratingData.sellerComment}
                  onChange={(e) => setRatingData(prev => ({ ...prev, sellerComment: e.target.value }))}
                  className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  rows={3}
                />
              </div>

              {/* Product Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Оценка товара
                </label>
                <StarRating
                  value={ratingData.productRating}
                  onChange={(value) => setRatingData(prev => ({ ...prev, productRating: value }))}
                />
                <textarea
                  placeholder="Отзыв о товаре (необязательно)"
                  value={ratingData.productReview}
                  onChange={(e) => setRatingData(prev => ({ ...prev, productReview: e.target.value }))}
                  className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSubmitRating}
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md"
                >
                  Отправить отзыв
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;