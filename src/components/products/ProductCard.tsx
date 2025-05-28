import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = React.useState(false);

  const isOwnProduct = user && product.seller_id === user.id;
  const productIsFavorite = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOwnProduct) {
      addToCart(product);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (productIsFavorite) {
      await removeFromFavorites(product.id);
    } else {
      await addToFavorites(product.id);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          
          {/* Overlay actions */}
          <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            {!isOwnProduct && (
              <button 
                onClick={handleAddToCart}
                className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition-colors"
                aria-label="Add to cart"
              >
                <ShoppingCart size={18} />
              </button>
            )}
            <button 
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full transition-colors ${
                productIsFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-800'
              }`}
              aria-label="Add to favorites"
            >
              <Heart size={18} fill={productIsFavorite ? "currentColor" : "none"} />
            </button>
          </div>
          
          {/* Category tag */}
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
            {product.category}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-teal-600 font-bold">₽{product.price.toFixed(2)}</span>
          </div>
          
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.title}</h3>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>
          
          <div className="flex items-center text-xs text-gray-500">
            <img 
              src={product.sellerAvatar}
              alt={product.sellerName} 
              className="w-6 h-6 rounded-full mr-2 object-cover" 
            />
            <span>{product.sellerName}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;