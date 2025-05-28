import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { auth } from '../services/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await auth.getCurrentUser();
      setUser(user);
      if (user) {
        const { data: profile } = await auth.getProfile(user.id);
        setIsAdmin(profile?.is_admin || false);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await auth.login(email, password);
      const user = await auth.getCurrentUser();
      setUser(user);
      if (user) {
        const { data: profile } = await auth.getProfile(user.id);
        setIsAdmin(profile?.is_admin || false);
      }
      toast.success('Вход выполнен успешно');
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Ошибка при входе');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      await auth.register(email, password);
      const user = await auth.getCurrentUser();
      setUser(user);
      if (user) {
        const { data: profile } = await auth.getProfile(user.id);
        setIsAdmin(profile?.is_admin || false);
      }
      toast.success('Регистрация выполнена успешно');
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Ошибка при регистрации');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await auth.logout();
      setUser(null);
      setIsAdmin(false);
      toast.success('Выход выполнен успешно');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Ошибка при выходе');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};