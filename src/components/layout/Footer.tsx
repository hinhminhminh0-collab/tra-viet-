import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="bg-[#1f3d2b] text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold tracking-tight">PHÚC LINH</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            {t('footer.description')}
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/migngiaqn" target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-white/80 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white/80 transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-medium mb-6">{t('footer.quickLinks')}</h3>
          <ul className="space-y-4 text-sm text-white/60">
            <li><Link to="/shop" className="hover:text-white transition-colors">{t('nav.shop')}</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-medium mb-6">{t('common.category')}</h3>
          <ul className="space-y-4 text-sm text-white/60">
            <li><Link to="/shop?cat=bach-tra" className="hover:text-white transition-colors">Bạch trà</Link></li>
            <li><Link to="/shop?cat=hong-tra" className="hover:text-white transition-colors">Hồng trà</Link></li>
            <li><Link to="/shop?cat=oolong" className="hover:text-white transition-colors">Trà Olong</Link></li>
            <li><Link to="/shop?cat=pho-nhi" className="hover:text-white transition-colors">Trà Phổ Nhĩ</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-medium mb-6">{t('footer.contact')}</h3>
          <ul className="space-y-4 text-sm text-white/60">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="shrink-0" />
              <span>123 Tân Cương, Thái Nguyên, Việt Nam </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="shrink-0" />
              <span>0898992654</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="shrink-0" />
              <span>contact@phuclinh.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p>© 2026 PHÚC LINH. {t('footer.rights')}</p>
          <div className="hidden md:block w-px h-3 bg-white/10" />
          <p className="font-mono tracking-widest text-[10px] uppercase">
            {currentTime.toLocaleDateString('vi-VN')} — {currentTime.toLocaleTimeString('vi-VN', { hour12: false })}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {['vi', 'en', 'fr', 'ja', 'zh'].map((lang) => (
            <button
              key={lang}
              onClick={() => i18n.changeLanguage(lang)}
              className={cn(
                "hover:text-white transition-colors uppercase font-bold tracking-widest",
                i18n.language === lang ? "text-white underline underline-offset-4" : "text-white/40"
              )}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Link to="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
        </div>
      </div>
    </footer>
  );
}
