import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Package, LogOut, User, Plus, Heart, Settings, Box, ListOrdered, MessageSquare, Shield } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

const Navbar = () => {
  const { itemCount } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { conversations } = useChat();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadMessagesCount = conversations.reduce(
    (sum, conv) => sum + conv.unread_count,
    0
  );

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-teal-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Package size={28} className="text-amber-300" />
            <span className="text-xl font-bold">МаркетХаб</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Поиск товаров..."
                className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="hover:text-amber-300 transition-colors">Товары</Link>

            {isAuthenticated && (
              <Link to="/create-product" className="hover:text-amber-300 transition-colors flex items-center">
                <Plus size={18} className="mr-1" />
                Создать объявление
              </Link>
            )}

            <Link to="/cart" className="relative hover:text-amber-300 transition-colors">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{itemCount}</span>
              )}
            </Link>

            {isAuthenticated && (
              <Link to="/messages" className="relative hover:text-amber-300 transition-colors">
                <MessageSquare size={22} />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{unreadMessagesCount}</span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={toggleProfile} className="flex items-center space-x-1 hover:text-amber-300 transition-colors focus:outline-none">
                  <img src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-amber-300" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => setIsProfileOpen(false)}>
                      <User size={16} className="mr-2" /> Мой профиль
                    </Link>
                    <Link to="/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => setIsProfileOpen(false)}>
                      <Heart size={16} className="mr-2" /> Избранное
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => setIsProfileOpen(false)}>
                      <ListOrdered size={16} className="mr-2" /> История заказов
                    </Link>
                    <Link to="/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => setIsProfileOpen(false)}>
                      <MessageSquare size={16} className="mr-2" /> Сообщения
                      {unreadMessagesCount > 0 && (
                        <span className="ml-auto bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{unreadMessagesCount}</span>
                      )}
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => setIsProfileOpen(false)}>
                        <Shield size={16} className="mr-2" /> Панель администратора
                      </Link>
                    )}
                    <div className="border-t border-gray-100 pt-1">
                      <div className="px-4 py-2">
                        <span className="text-xs font-medium text-gray-500 uppercase">Мои товары</span>
                      </div>
                      <Link to="/create-product" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => setIsProfileOpen(false)}>
                        <Plus size={16} className="mr-2" /> Создать объявление
                      </Link>
                      <Link to="/mylistings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => setIsProfileOpen(false)}>
                        <Box size={16} className="mr-2" /> Мои объявления
                      </Link>
                    </div>
                    <div className="border-t border-gray-100">
                      <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" onClick={() => setIsProfileOpen(false)}>
                        <Settings size={16} className="mr-2" /> Настройки
                      </Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
                        <LogOut size={16} className="mr-2" /> Выйти
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors">Войти</Link>
            )}
          </div>

          <button onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
