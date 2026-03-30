import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Leaf, ShieldCheck, Truck, Clock } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ui/ProductCard';
import TeaQuiz from '../components/ui/TeaQuiz';
import { Product } from '../types';
import { db } from '../firebase';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';

const CATEGORIES = [
  { name: 'Bạch trà', image: 'https://picsum.photos/seed/cat1/600/800', count: 12 },
  { name: 'Hồng trà', image: 'https://picsum.photos/seed/cat2/600/800', count: 18 },
  { name: 'Trà Oolong', image: 'https://picsum.photos/seed/cat3/600/800', count: 15 },
  { name: 'Trà Phổ Nhĩ', image: 'https://picsum.photos/seed/cat4/600/800', count: 8 },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          orderBy('rating', 'desc'),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/tea-hero/1920/1080?blur=2"
            alt="Tea Hero"
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white space-y-8 px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-80">
              Tinh hoa trà Việt
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
              Chạm vào hơi thở <br /> của núi rừng
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Khám phá những phẩm trà tinh túy nhất từ các vùng trà cổ thụ nghìn năm tuổi của Việt Nam. Nơi văn hóa trà đạo gặp gỡ sự tinh tế hiện đại.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/shop"
              className="bg-white text-[#1f3d2b] px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#1f3d2b] hover:text-white transition-all duration-500 shadow-xl"
            >
              Mua ngay
            </Link>
            <Link
              to="/about"
              className="text-white border border-white/30 px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all duration-500 backdrop-blur-sm"
            >
              Câu chuyện trà
            </Link>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
          <div className="w-px h-12 bg-white/30 mx-auto" />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <Leaf />, title: "100% Tự nhiên", desc: "Trà sạch từ vùng cao" },
            { icon: <ShieldCheck />, title: "Chất lượng", desc: "Kiểm định nghiêm ngặt" },
            { icon: <Truck />, title: "Giao hàng nhanh", desc: "Toàn quốc 2-3 ngày" },
            { icon: <Clock />, title: "Hỗ trợ 24/7", desc: "Tư vấn trà đạo" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-3 group">
              <div className="p-4 rounded-full bg-[#f5f2ed] text-[#1f3d2b] group-hover:bg-[#1f3d2b] group-hover:text-white transition-all duration-500">
                {item.icon}
              </div>
              <h3 className="font-bold text-[#1f3d2b]">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#1f3d2b] uppercase tracking-widest">Danh mục</span>
              <h2 className="text-4xl font-serif font-bold text-[#1f3d2b]">Khám phá thế giới trà</h2>
            </div>
            <Link to="/shop" className="text-sm font-bold text-[#1f3d2b] flex items-center gap-2 hover:opacity-70 transition-opacity">
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={i}
                to={`/shop?cat=${cat.name}`}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 text-white space-y-1">
                  <h3 className="text-2xl font-serif font-bold">{cat.name}</h3>
                  <p className="text-xs opacity-60">{cat.count} sản phẩm</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight Products */}
      <section className="py-24 px-6 bg-[#1f3d2b]/5">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-[#1f3d2b] uppercase tracking-widest">Bán chạy nhất</span>
            <h2 className="text-4xl font-serif font-bold text-[#1f3d2b]">Phẩm trà được yêu thích</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-3xl bg-white/50 animate-pulse" />
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          
          <div className="text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-[#1f3d2b] font-bold border-b-2 border-[#1f3d2b] pb-1 hover:opacity-70 transition-opacity"
            >
              Xem tất cả sản phẩm <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img
                src="https://picsum.photos/seed/tea-story/800/800"
                alt="Tea Story"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#1f3d2b]/10 rounded-full blur-3xl -z-0" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl -z-0" />
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-xl z-20 hidden md:block max-w-[240px]">
              <p className="text-sm italic text-gray-600 leading-relaxed">
                "Trà không chỉ là thức uống, trà là hơi thở, là sự tĩnh lặng giữa dòng đời hối hả."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1f3d2b]" />
                <div>
                  <p className="text-xs font-bold text-[#1f3d2b]">Trần Văn Trà</p>
                  <p className="text-[10px] text-gray-400">Nghệ nhân trà đạo</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#1f3d2b] uppercase tracking-widest">Về chúng tôi</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1f3d2b] leading-tight">
                Lan tỏa văn hóa <br /> trà Việt tinh túy
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              Chúng tôi đi tìm những búp trà Shan Tuyết cổ thụ hàng trăm năm tuổi trên những đỉnh núi cao mờ sương. Mỗi phẩm trà là một câu chuyện về đất, về người và về sự kiên nhẫn của thời gian.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Trà Việt không chỉ bán trà, chúng tôi mang đến một lối sống tỉnh thức, giúp bạn tìm lại sự bình yên trong tâm hồn qua từng chén trà thơm.
            </p>
            <div className="pt-4">
              <Link to="/about" className="inline-flex items-center gap-2 text-[#1f3d2b] font-bold border-b-2 border-[#1f3d2b] pb-1 hover:opacity-70 transition-opacity">
                Khám phá câu chuyện <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Quiz Section */}
      <section className="py-24 px-6 bg-[#fcfbf7]">
        <div className="max-w-5xl mx-auto">
          <TeaQuiz />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 bg-[#1f3d2b] text-white text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-serif font-bold">Gia nhập cộng đồng yêu trà</h2>
            <p className="text-white/60">Đăng ký nhận tin để cập nhật kiến thức trà đạo và ưu đãi mới nhất.</p>
          </div>
          <form className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-8 py-4 focus:outline-none focus:border-white transition-colors"
            />
            <button className="bg-white text-[#1f3d2b] px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all">
              Đăng ký
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
