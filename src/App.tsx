import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import ProductListingPage from './pages/ProductListingPage';
import CreateProductPage from './pages/CreateProductPage';
import EditProductPage from './pages/EditProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FavoritesPage from './pages/FavoritesPage';
import MessagesPage from './pages/MessagesPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ChatProvider } from './context/ChatContext';
import MyListingsPage from './pages/MyListingsPage';
import SellerProfilePage from './pages/SellerProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <ChatProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route 
                      path="/admin/*" 
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      } 
                    />
                   <Route 
  path="/profile" 
  element={
    <PrivateRoute>
      <SellerProfilePage isSelf />
    </PrivateRoute>
  }
/>
                   <Route 
  path="/profile/:id" 
  element={
    <PrivateRoute>
      <SellerProfilePage />
    </PrivateRoute>
  }
/>
                    <Route 
  path="/settings" 
  element={
    <PrivateRoute>
      <SettingsPage />
    </PrivateRoute>
  }
/>
                    <Route 
                      path="/orders" 
                      element={
                        <PrivateRoute>
                          <OrdersPage />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/favorites" 
                      element={
                        <PrivateRoute>
                          <FavoritesPage />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/messages" 
                      element={
                        <PrivateRoute>
                          <MessagesPage />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/product/:id" 
                      element={
                        <PrivateRoute>
                          <ProductPage />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/products" 
                      element={
                        <PrivateRoute>
                          <ProductListingPage />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
  path="/mylistings" 
  element={
    <PrivateRoute>
      <MyListingsPage />
    </PrivateRoute>
  }
/>
                    <Route 
                      path="/create-product" 
                      element={
                        <PrivateRoute>
                          <CreateProductPage />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/edit-product/:id" 
                      element={
                        <PrivateRoute>
                          <EditProductPage />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/cart" 
                      element={
                        <PrivateRoute>
                          <CartPage />
                        </PrivateRoute>
                      } 
                    />
                  </Routes>
                </main>
                <Footer />
                <Toaster position="top-right" />
              </div>
            </Router>
          </ChatProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;