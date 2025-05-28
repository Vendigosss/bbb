import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, Flag, Star, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useChat } from '../context/ChatContext';
import { Product } from '../types';
import { productService } from '../services/products';
import { reportService } from '../services/reports';
import ReportDialog from '../components/products/ReportDialog';
import toast from 'react-hot-toast';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { startConversation } = useChat();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const StarRating = ({ rating, size = 'small' }: { rating: number; size?: 'small' | 'large' }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size === 'large' ? 20 : 16}
          className={star <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'}
        />
      ))}
    </div>
  );
  
  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    
    try {
      const productData = await productService.getProductById(id);
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isOwnProduct = user && product && product.seller_id === user.id;
  const productIsFavorite = product ? isFavorite(product.id) : false;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка товара...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Товар не найден</h2>
          <p className="text-gray-600 mb-8">Товар, который вы ищете, не существует или был удален.</p>
          <Link 
            to="/products" 
            className="inline-flex items-center text-teal-600 hover:text-teal-800"
          >
            <ChevronLeft size={20} className="mr-1" />
            Вернуться к товарам
          </Link>
        </div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    if (isOwnProduct) return;
    addToCart(product, quantity);
  };

  const handleToggleFavorite = async () => {
    if (productIsFavorite) {
      await removeFromFavorites(product.id);
    } else {
      await addToFavorites(product.id);
    }
  };
  
  const handlePrevImage = () => {
    setActiveImageIndex(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };
  
  const handleNextImage = () => {
    setActiveImageIndex(prev => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleStartChat = async () => {
    if (!user || isOwnProduct || isStartingChat) return;

    setIsStartingChat(true);
    try {
      const conversationId = await startConversation(product.id, product.seller_id);
      if (conversationId) {
        navigate(`/messages?conversation=${conversationId}`);
      } else {
        toast.error('Не удалось начать диалог');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Произошла ошибка');
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleReport = async (reason: string) => {
    try {
      await reportService.createReport(product.id, reason);
      toast.success('Жалоба отправлена');
    } catch (error) {
      console.error('Error reporting product:', error);
      toast.error(error.message || 'Ошибка при отправке жалобы');
    }
  };

  const sellerProfile = (product as any).profiles;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/products" className="text-teal-600 hover:text-teal-800 flex items-center">
          <ChevronLeft size={18} /> Назад к товарам
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 h-96">
              <img 
                src={product.images[activeImageIndex]} 
                alt={product.title} 
                className="w-full h-full object-contain"
              />
              
              {product.images.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    aria-label="Предыдущее изображение"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    aria-label="Следующее изображение"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      index === activeImageIndex ? 'border-teal-500' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.title} миниатюра ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <span className="text-sm font-medium text-teal-600 bg-teal-50 py-1 px-2 rounded-full">
                {product.category}
              </span>
              <h1 className="text-2xl font-bold text-gray-800 mt-2">{product.title}</h1>
              
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">₽{product.price.toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <StarRating rating={product.rating} />
                  <span className="ml-2 text-sm text-gray-600">
                    {product.reviewCount} {product.reviewCount === 1 ? 'отзыв' : 'отзывов'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Описание</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <Link 
                to={`/profile/${product.seller_id}`}
                className="flex items-center space-x-4"
              >
                <img 
                  src={product.sellerAvatar}
                  alt={product.sellerName} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {product.sellerName}
                  </p>
                  <div className="flex items-center mt-1">
                    <StarRating rating={product.sellerRating} />
                    <span className="ml-2 text-sm text-gray-600">
                      {product.sellerTotalRatings} {product.sellerTotalRatings === 1 ? 'оценка' : 'оценок'}
                    </span>
                  </div>
                  {product.sellerBio && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.sellerBio}</p>
                  )}
                </div>
                <ChevronRight className="text-gray-400" />
              </Link>
              
              {!isOwnProduct && (
                <button 
                  onClick={handleStartChat}
                  disabled={isStartingChat}
                  className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <MessageCircle size={18} className="mr-2" />
                  {isStartingChat ? 'Создание диалога...' : 'Связаться с продавцом'}
                </button>
              )}
            </div>
            
            {!isOwnProduct ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-gray-800">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Добавить в корзину
                  </button>
                  
                  <button 
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-md border ${
                      productIsFavorite 
                        ? 'border-red-300 bg-red-50 text-red-500' 
                        : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                    }`}
                    aria-label="Добавить в избранное"
                  >
                    <Heart size={20} fill={productIsFavorite ? "currentColor" : "none"} />
                  </button>
                  
                  <button 
                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-600"
                    aria-label="Поделиться"
                  >
                    <Share2 size={20} />
                  </button>
                </div>

                <button
                  onClick={() => setIsReportDialogOpen(true)}
                  className="w-full flex items-center justify-center text-red-600 hover:text-red-800 text-sm font-medium py-2"
                >
                  <Flag size={16} className="mr-2" />
                  Пожаловаться на объявление
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-center">Это ваш товар</p>
                <Link
                  to={`/edit-product/${product.id}`}
                  className="mt-2 w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center justify-center"
                >
                  Редактировать товар
                </Link>
              </div>
            )}
          </div>
        </div>

        {product.reviews && product.reviews.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Отзывы покупателей ({product.reviewCount})
            </h3>
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 last:border-0 pb-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={review.buyer?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${review.buyer?.name}`}
                      alt={review.buyer?.name || 'Покупатель'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">
                        {review.buyer?.name || 'Покупатель'}
                      </p>
                      <div className="flex items-center mt-1">
                        <StarRating rating={review.rating} />
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.review && (
                    <p className="text-gray-600">{review.review}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        onSubmit={handleReport}
      />
    </div>
  );
};

export default ProductPage;