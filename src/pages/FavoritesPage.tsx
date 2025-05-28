import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/products/ProductCard';

const FavoritesPage = () => {
  const { favorites, isLoading } = useFavorites();

  if (isLoading) {
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

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Избранные товары</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-800 mb-2">У вас пока нет избранных товаров</h2>
          <p className="text-gray-600 mb-6">Добавляйте товары в избранное, чтобы не потерять их</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Перейти к товарам
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;