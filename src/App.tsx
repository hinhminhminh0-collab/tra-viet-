import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers';
import AdminBlog from './pages/AdminBlog';
import AdminCategories from './pages/AdminCategories';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import { seedProducts } from './lib/seed';

export default function App() {
  useEffect(() => {
    seedProducts();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster position="top-center" richColors />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
