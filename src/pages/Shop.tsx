import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ChevronDown, X, Leaf } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ProductSkeleton } from '../components/ui/Loading';

const CATEGORIES = ['Tất cả', 'Bạch trà', 'Hồng trà', 'Lục trà', 'Oolong', 'Phổ Nhĩ', 'Trà thảo mộc'];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'Tất cả');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      <Header />

      {/* Hero Header */}
      <section className="pt-40 pb-20 px-6 bg-[#1f3d2b] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Cửa hàng Trà Việt</h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Khám phá bộ sưu tập những phẩm trà tinh túy nhất từ các vùng trà cổ thụ của Việt Nam.
          </p>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-[72px] z-40 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#1f3d2b] transition-colors"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={16} />
              Lọc & Sắp xếp
            </button>
            <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                    selectedCategory === cat ? "bg-[#1f3d2b] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="max-w-7xl mx-auto pt-6 pb-2 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 mt-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#1f3d2b] uppercase tracking-widest">Sắp xếp theo</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'newest', label: 'Mới nhất' },
                      { id: 'price-low', label: 'Giá thấp đến cao' },
                      { id: 'price-high', label: 'Giá cao đến thấp' },
                      { id: 'rating', label: 'Đánh giá cao nhất' },
                    ].map(sort => (
                      <button
                        key={sort.id}
                        onClick={() => setSortBy(sort.id)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm transition-all",
                          sortBy === sort.id ? "bg-[#1f3d2b] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {sort.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#1f3d2b] uppercase tracking-widest">Khoảng giá</h3>
                  <div className="flex items-center gap-4">
                    <input type="number" placeholder="Từ" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm" />
                    <span className="text-gray-400">-</span>
                    <input type="number" placeholder="Đến" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#1f3d2b] uppercase tracking-widest">Xuất xứ</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Hà Giang', 'Yên Bái', 'Thái Nguyên', 'Lâm Đồng', 'Điện Biên'].map(origin => (
                      <button key={origin} className="px-4 py-2 rounded-xl text-sm bg-gray-100 text-gray-600 hover:bg-gray-200">
                        {origin}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Product Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-gray-500">
              Hiển thị <span className="font-bold text-[#1f3d2b]">{filteredProducts.length}</span> sản phẩm
            </p>
            {selectedCategory !== 'Tất cả' && (
              <button
                onClick={() => setSelectedCategory('Tất cả')}
                className="flex items-center gap-1 text-xs font-bold text-red-500 uppercase tracking-widest hover:opacity-70"
              >
                Xóa lọc <X size={14} />
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {[...Array(10)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center space-y-4">
              <div className="text-6xl">🍃</div>
              <h3 className="text-2xl font-serif font-bold text-[#1f3d2b]">Không tìm thấy sản phẩm nào</h3>
              <p className="text-gray-500">Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('Tất cả'); }}
                className="bg-[#1f3d2b] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
