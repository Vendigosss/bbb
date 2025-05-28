import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/products/ProductCard';
import { productService } from '../services/products';
import { Product, Category } from '../types';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const [products, categoriesData] = await Promise.all([
        productService.getProducts(),
        productService.getCategories()
      ]);
      setFeaturedProducts(products.slice(0, 4));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Находите отличные товары от проверенных продавцов
              </h1>
              <p className="text-lg md:text-xl mb-8 text-teal-100">
                Присоединяйтесь к тысячам пользователей, покупающих и продающих уникальные товары на МаркетХаб, 
                самом безопасном и надежном маркетплейсе.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link 
                    to="/products" 
                    className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-center"
                  >
                    Смотреть товары
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-center"
                  >
                    Войти для просмотра товаров
                  </Link>
                )}
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Marketplace shopping" 
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Популярные категории</h2>
            {isAuthenticated && (
              <Link to="/products" className="text-teal-600 hover:text-teal-800 flex items-center">
                Смотреть все <ChevronRight size={16} />
              </Link>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <Link 
                key={category.id} 
                to={isAuthenticated ? `/products?category=${category.slug}` : '/login'}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-center group"
              >
                <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-100 transition-colors">
                  <span className="text-2xl">
                    {category.name === 'Электроника' && '📱'}
                    {category.name === 'Одежда' && '👕'}
                    {category.name === 'Дом и сад' && '🏠'}
                    {category.name === 'Спорт и отдых' && '🏋️'}
                    {category.name === 'Книги и медиа' && '📚'}
                    {category.name === 'Коллекционирование' && '🎨'}
                    {category.name === 'Автотовары' && '🚗'}
                    {category.name === 'Игрушки и игры' && '🎮'}
                    {category.name === 'Красота и здоровье' && '💄'}
                    {category.name === 'Товары для животных' && '🐾'}
                    {category.name === 'Другое' && '📦'}
                  </span>
                </div>
                <h3 className="font-medium text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-500">
                 {/* {category.productCount || 0} товаров*/}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - only show if authenticated */}
      {isAuthenticated && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Рекомендуемые товары</h2>
              <Link to="/products" className="text-teal-600 hover:text-teal-800 flex items-center">
                Смотреть все <ChevronRight size={16} />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">На данный момент нет доступных товаров.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Trust badges section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Почему выбирают МаркетХаб?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Безопасные сделки</h3>
              <p className="text-gray-600">Наша система безопасных платежей защищает ваши деньги до получения товара.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Проверенные продавцы</h3>
              <p className="text-gray-600">Все продавцы проходят верификацию и имеют рейтинг от покупателей.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Прямое общение</h3>
              <p className="text-gray-600">Общайтесь напрямую с продавцами для обсуждения деталей и цен.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;