import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1f3d2b] text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold tracking-tight">TRÀ VIỆT</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Lan tỏa văn hóa trà Việt tinh túy đến mọi nhà. Chúng tôi cam kết mang đến những sản phẩm trà sạch, chất lượng cao từ các vùng trà nổi tiếng của Việt Nam.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white/80 transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-white/80 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white/80 transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-medium mb-6">Liên kết nhanh</h3>
          <ul className="space-y-4 text-sm text-white/60">
            <li><Link to="/shop" className="hover:text-white transition-colors">Tất cả sản phẩm</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Kiến thức trà</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Liên hệ</Link></li>
            <li><Link to="/shipping" className="hover:text-white transition-colors">Chính sách giao hàng</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-medium mb-6">Danh mục trà</h3>
          <ul className="space-y-4 text-sm text-white/60">
            <li><Link to="/shop?cat=bach-tra" className="hover:text-white transition-colors">Bạch trà</Link></li>
            <li><Link to="/shop?cat=hong-tra" className="hover:text-white transition-colors">Hồng trà</Link></li>
            <li><Link to="/shop?cat=oolong" className="hover:text-white transition-colors">Trà Oolong</Link></li>
            <li><Link to="/shop?cat=pho-nhi" className="hover:text-white transition-colors">Trà Phổ Nhĩ</Link></li>
            <li><Link to="/shop?cat=tra-cu" className="hover:text-white transition-colors">Trà cụ & Quà tặng</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-medium mb-6">Thông tin liên hệ</h3>
          <ul className="space-y-4 text-sm text-white/60">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="shrink-0" />
              <span>123 Đường Trà Đạo, Quận 1, TP. Hồ Chí Minh</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="shrink-0" />
              <span>+84 123 456 789</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="shrink-0" />
              <span>contact@traviet.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
        <p>© 2026 TRÀ VIỆT. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
        </div>
      </div>
    </footer>
  );
}
