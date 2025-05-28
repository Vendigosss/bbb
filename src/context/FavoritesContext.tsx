import React, { createContext, useContext, useState, useEffect } from 'react';
import { favoritesService } from '../services/favorites';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface FavoritesContextType {
  favorites: Product[];
  isLoading: boolean;
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const data = await favoritesService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToFavorites = async (productId: string) => {
    try {
      // Check if already in favorites to prevent unnecessary API call
      if (isFavorite(productId)) {
        toast.success('Уже в избранном');
        return;
      }

      const success = await favoritesService.addToFavorites(productId);
      if (success) {
        await loadFavorites();
        toast.success('Добавлено в избранное');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Ошибка при добавлении в избранное');
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      const success = await favoritesService.removeFromFavorites(productId);
      if (success) {
        setFavorites(prev => prev.filter(item => item.id !== productId));
        toast.success('Удалено из избранного');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Ошибка при удалении из избранного');
    }
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.some(item => item.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};