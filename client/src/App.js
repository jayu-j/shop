import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProductList from './pages/Admin/ProductList';
import ProductEdit from './pages/Admin/ProductEdit';
import OrderList from './pages/Admin/OrderList';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import './App.css';

import { WishlistProvider } from './context/WishlistContext';

import ScrollToTop from './components/ScrollToTop';

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <div key={location.pathname} className="page-transition animate-slide-up">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/products/new" element={<ProductEdit />} />
              <Route path="/admin/products/:id/edit" element={<ProductEdit />} />
              <Route path="/admin/orders" element={<OrderList />} />
            </Route>
          </Routes>
        </div>
      </main>
      <Footer />
    </div >
  );
}

export default App;
