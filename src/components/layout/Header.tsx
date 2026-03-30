import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { cn } from '../../lib/utils';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Sản phẩm', path: '/shop' },
    { name: 'Kiến thức trà', path: '/blog' },
    { name: 'Về chúng tôi', path: '/about' },
    { name: 'Liên hệ', path: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className={cn(
              "text-2xl font-serif font-bold tracking-tight",
              isScrolled ? "text-[#1f3d2b]" : "text-white"
            )}>
              TRÀ VIỆT
            </span>
            {isAdmin && (
              <span className="bg-red-500 text-white text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                Admin
              </span>
            )}
          </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:opacity-70",
                location.pathname === link.path ? "opacity-100" : "opacity-60",
                isScrolled ? "text-[#1f3d2b]" : "text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-5">
          <button className={cn("hover:opacity-70 transition-opacity", isScrolled ? "text-[#1f3d2b]" : "text-white")}>
            <Search size={20} />
          </button>
          <Link to="/wishlist" className={cn("hover:opacity-70 transition-opacity", isScrolled ? "text-[#1f3d2b]" : "text-white")}>
            <Heart size={20} />
          </Link>
          <Link to="/cart" className={cn("relative hover:opacity-70 transition-opacity", isScrolled ? "text-[#1f3d2b]" : "text-white")}>
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#1f3d2b] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {totalItems}
              </span>
            )}
          </Link>
          <Link to={user ? "/profile" : "/auth"} className={cn("hover:opacity-70 transition-opacity", isScrolled ? "text-[#1f3d2b]" : "text-white")}>
            <User size={20} />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} className={isScrolled ? "text-[#1f3d2b]" : "text-white"} /> : <Menu size={24} className={isScrolled ? "text-[#1f3d2b]" : "text-white"} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl p-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-medium text-[#1f3d2b] border-b border-gray-100 pb-2"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-6 pt-4">
              <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-[#1f3d2b]">
                <ShoppingCart size={24} />
              </Link>
              <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="text-[#1f3d2b]">
                <Heart size={24} />
              </Link>
              <Link to={user ? "/profile" : "/auth"} onClick={() => setIsMenuOpen(false)} className="text-[#1f3d2b]">
                <User size={24} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
