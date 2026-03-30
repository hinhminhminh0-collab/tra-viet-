import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Heart, Package, ArrowUp, ArrowRight, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(newLang);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.shop'), path: '/shop' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
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
              isScrolled ? "text-tea-primary" : "text-white"
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
                isScrolled ? "text-tea-primary" : "text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-5">
          <div className={cn(
            "text-[10px] font-mono font-bold tracking-widest px-3 py-1 rounded-full border transition-all duration-300 flex items-center gap-2",
            isScrolled 
              ? "text-tea-primary border-tea-primary/10 bg-tea-primary/5" 
              : "text-white border-white/20 bg-white/10 backdrop-blur-sm"
          )}>
            <span className="opacity-50">{currentTime.toLocaleDateString('vi-VN')}</span>
            <span className="w-px h-2 bg-current opacity-20" />
            {currentTime.toLocaleTimeString('vi-VN', { hour12: false })}
          </div>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className={cn("hover:opacity-70 transition-opacity", isScrolled ? "text-tea-primary" : "text-white")}
          >
            <Search size={20} />
          </button>
          <Link to="/wishlist" className={cn("hover:opacity-70 transition-opacity", isScrolled ? "text-tea-primary" : "text-white")}>
            <Heart size={20} />
          </Link>
          <Link to="/cart" className={cn("relative hover:opacity-70 transition-opacity", isScrolled ? "text-tea-primary" : "text-white")}>
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-tea-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {totalItems}
              </span>
            )}
          </Link>
          {isAdmin && (
            <Link to="/admin/orders" className={cn("hover:opacity-70 transition-opacity", isScrolled ? "text-tea-primary" : "text-white")}>
              <Package size={20} />
            </Link>
          )}
          <Link to={user ? "/profile" : "/auth"} className={cn("hover:opacity-70 transition-opacity", isScrolled ? "text-tea-primary" : "text-white")}>
            <User size={20} />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} className={isScrolled ? "text-tea-primary" : "text-white"} /> : <Menu size={24} className={isScrolled ? "text-tea-primary" : "text-white"} />}
        </button>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-tea-primary/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="relative w-full max-w-3xl"
            >
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="absolute -top-16 right-0 text-white/60 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
              <form onSubmit={handleSearch} className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="Tìm kiếm sản phẩm trà..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-white/20 py-6 text-4xl md:text-6xl font-serif text-white placeholder:text-white/20 focus:outline-none focus:border-white transition-colors"
                />
                <button 
                  type="submit"
                  className="absolute right-0 bottom-6 text-white/40 hover:text-white transition-colors"
                >
                  <ArrowRight size={40} />
                </button>
              </form>
              <div className="mt-8 flex flex-wrap gap-4">
                <span className="text-white/40 text-sm">Gợi ý:</span>
                {['Bạch trà', 'Hồng trà', 'Oolong', 'Phổ Nhĩ', 'Shan Tuyết'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      navigate(`/shop?search=${encodeURIComponent(tag)}`);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-white/60 hover:text-white text-sm border border-white/10 px-4 py-1 rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                className="text-lg font-medium text-tea-dark border-b border-gray-100 pb-2"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-[10px] font-mono font-bold tracking-widest px-3 py-1 rounded-full border border-tea-primary/10 bg-tea-primary/5 text-tea-primary flex items-center gap-2">
                <span className="opacity-50">{currentTime.toLocaleDateString('vi-VN')}</span>
                <span className="w-px h-2 bg-current opacity-20" />
                {currentTime.toLocaleTimeString('vi-VN', { hour12: false })}
              </div>
              <div className="flex items-center gap-6">
                <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-tea-primary">
                  <ShoppingCart size={24} />
                </Link>
                <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="text-tea-primary">
                  <Heart size={24} />
                </Link>
                {isAdmin && (
                  <Link to="/admin/orders" onClick={() => setIsMenuOpen(false)} className="text-tea-primary">
                    <Package size={24} />
                  </Link>
                )}
                <Link to={user ? "/profile" : "/auth"} onClick={() => setIsMenuOpen(false)} className="text-tea-primary">
                  <User size={24} />
                </Link>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {['vi', 'en', 'fr', 'ja', 'zh'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      i18n.changeLanguage(lang);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors",
                      i18n.language === lang 
                        ? "bg-tea-primary text-white" 
                        : "bg-tea-primary/5 text-tea-primary"
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-2 right-4 z-50 bg-tea-primary text-white p-4 rounded-full shadow-2xl hover:bg-black transition-all"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </header>
  );
}
