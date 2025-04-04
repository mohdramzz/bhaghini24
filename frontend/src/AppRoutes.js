import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ShopManagementPage from './pages/ShopManagementPage';
import CreateShopPage from './pages/CreateShopPage';
import EditShopPage from './pages/EditShopPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import ShopsPage from './pages/ShopsPage';
import ShopDetailPage from './pages/ShopDetailPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/category/:id" element={<ProductsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/shops" element={<ShopsPage />} />
      <Route path="/shop/:id" element={<ShopDetailPage />} />
      
      {/* Protected routes */}
      <Route 
        path="/checkout" 
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/order/:id" 
        element={
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Shop Management Routes */}
      <Route 
        path="/shop-management" 
        element={
          <ProtectedRoute>
            <ShopManagementPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-shop" 
        element={
          <ProtectedRoute>
            <CreateShopPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit-shop/:id" 
        element={
          <ProtectedRoute>
            <EditShopPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/add-product" 
        element={
          <ProtectedRoute>
            <AddProductPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit-product/:id" 
        element={
          <ProtectedRoute>
            <EditProductPage />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 route */}
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
};

export default AppRoutes;