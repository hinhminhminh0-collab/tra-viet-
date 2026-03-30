import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../types';

const MOCK_WISHLIST: Product[] = [
  {
    id: '1',
    name: 'Bạch Trà Shan Tuyết Cổ Thụ',
    price: 450000,
    description: 'Bạch trà tinh khiết từ những búp trà cổ thụ trên đỉnh Tây Côn Lĩnh.',
    images: ['https://picsum.photos/seed/tea1/800/1000'],
    category: 'Bạch trà',
    origin: 'Hà Giang',
    taste: 'Thanh khiết, ngọt hậu',
    brewingGuide: 'Pha với nước 85 độ C',
    stock: 10,
    rating: 4.9,
    reviewsCount: 120
  },
  {
    id: '3',
    name: 'Trà Oolong Tứ Quý',
    price: 250000,
    description: 'Trà Oolong thơm hương hoa cỏ, vị ngọt dịu.',
    images: ['https://picsum.photos/seed/tea3/800/1000'],
    category: 'Oolong',
    origin: 'Lâm Đồng',
    taste: 'Thơm hoa, ngọt dịu',
    brewingGuide: 'Pha với nước 90 độ C',
    stock: 20,
    rating: 4.7,
    reviewsCount: 64
  }
];

export default function Wishlist() {
  const [items, setItems] = useState<Product[]>(MOCK_WISHLIST);

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.info("Đã xóa khỏi danh sách yêu thích.");
  };

  return (
    <div className="min-h-screen bg-tea-light">
      <Header />

      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-tea-dark">Sản phẩm yêu thích</h1>
            <p className="text-gray-500">Bạn đang lưu <span className="font-bold text-tea-dark">{items.length}</span> phẩm trà ưng ý.</p>
          </div>
          <Link to="/shop" className="text-sm font-bold text-tea-dark border-b-2 border-tea-dark pb-1 hover:opacity-70 transition-opacity">
            Khám phá thêm
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {items.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group"
                >
                  <ProductCard product={product} />
                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute top-4 left-4 bg-white/80 backdrop-blur-md p-2 rounded-full text-red-500 shadow-md hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-32 text-center space-y-8">
            <div className="w-32 h-32 bg-[#f5f2ed] rounded-full flex items-center justify-center mx-auto">
              <Heart size={48} className="text-tea-dark/20" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-serif font-bold text-tea-dark">Chưa có sản phẩm yêu thích</h2>
              <p className="text-gray-500">Hãy dạo quanh cửa hàng và thả tim cho những phẩm trà bạn thích nhé.</p>
            </div>
            <Link
              to="/shop"
              className="inline-block bg-tea-primary text-white px-12 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl shadow-tea-primary/20"
            >
              Xem cửa hàng
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
