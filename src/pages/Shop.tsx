import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ChevronDown, X, Leaf, Plus } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../types';
import { cn, formatPrice } from '../lib/utils';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, addDoc } from 'firebase/firestore';
import { ProductSkeleton } from '../components/ui/Loading';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Tất cả', 'Bạch trà', 'Hồng trà', 'Lục trà', 'Oolong', 'Phổ Nhĩ', 'Trà thảo mộc'];

const SAMPLE_PRODUCTS = [
  {
    name: "Chè Thái Nguyên Đặc Biệt",
    price: 250000,
    category: "Lục trà",
    origin: "Thái Nguyên",
    description: "Chè Thái Nguyên nổi tiếng với hương cốm non, vị chát dịu và hậu ngọt sâu.",
    images: ["https://picsum.photos/seed/greentea1/800/800"],
    stock: 100,
    rating: 4.8,
    reviewsCount: 45
  },
  {
    name: "Hồng Trà Cổ Thụ Hà Giang",
    price: 450000,
    category: "Hồng trà",
    origin: "Hà Giang",
    description: "Được chế biến từ những búp trà Shan Tuyết cổ thụ, mang hương thơm trái cây chín và vị ngọt mật.",
    images: ["https://picsum.photos/seed/blacktea1/800/800"],
    stock: 50,
    rating: 4.9,
    reviewsCount: 32
  },
  {
    name: "Chè Shan Tuyết Suối Giàng",
    price: 600000,
    category: "Bạch trà",
    origin: "Yên Bái",
    description: "Chè Shan Tuyết tinh khiết từ vùng núi cao Suối Giàng, hương thanh tao, vị ngọt thanh mát.",
    images: ["https://picsum.photos/seed/whitetea1/800/800"],
    stock: 30,
    rating: 5.0,
    reviewsCount: 18
  },
  {
    name: "Oolong Tứ Quý Lâm Đồng",
    price: 350000,
    category: "Oolong",
    origin: "Lâm Đồng",
    description: "Trà Oolong Tứ Quý có hương hoa lan nồng nàn, nước trà vàng xanh trong trẻo.",
    images: ["https://picsum.photos/seed/oolong1/800/800"],
    stock: 80,
    rating: 4.7,
    reviewsCount: 28
  },
  {
    name: "Phổ Nhĩ Sống Tây Côn Lĩnh",
    price: 1200000,
    category: "Phổ Nhĩ",
    origin: "Hà Giang",
    description: "Trà Phổ Nhĩ sống được ép bánh từ lá trà cổ thụ, càng để lâu càng ngon và giá trị.",
    images: ["https://picsum.photos/seed/puerh1/800/800"],
    stock: 20,
    rating: 4.9,
    reviewsCount: 12
  },
  {
    name: "Chè Vằng Sẻ Quảng Trị",
    price: 150000,
    category: "Trà thảo mộc",
    origin: "Quảng Trị",
    description: "Chè Vằng sẻ giúp thanh nhiệt, giải độc, đặc biệt tốt cho phụ nữ sau sinh.",
    images: ["https://picsum.photos/seed/chevang/800/800"],
    stock: 150,
    rating: 4.6,
    reviewsCount: 56
  },
  {
    name: "Trà Sen Tây Hồ",
    price: 800000,
    category: "Lục trà",
    origin: "Hà Nội",
    description: "Đệ nhất trà Việt, được ướp từ sen bách diệp Tây Hồ theo phương pháp truyền thống.",
    images: ["https://picsum.photos/seed/lotustea1/800/800"],
    stock: 15,
    rating: 5.0,
    reviewsCount: 25
  },
  {
    name: "Chè Dây Cao Bằng",
    price: 180000,
    category: "Trà thảo mộc",
    origin: "Cao Bằng",
    description: "Chè dây rừng tự nhiên, hỗ trợ tiêu hóa và giảm viêm loét dạ dày.",
    images: ["https://picsum.photos/seed/cheday/800/800"],
    stock: 120,
    rating: 4.7,
    reviewsCount: 40
  },
  {
    name: "Chè Đắng Cao Bằng",
    price: 320000,
    category: "Trà thảo mộc",
    origin: "Cao Bằng",
    description: "Loại trà có vị đắng đặc trưng nhưng hậu ngọt, giúp ổn định huyết áp và đường huyết.",
    images: ["https://picsum.photos/seed/chedang/800/800"],
    stock: 40,
    rating: 4.8,
    reviewsCount: 22
  },
  {
    name: "Bạch Trà Móng Rồng",
    price: 750000,
    category: "Bạch trà",
    origin: "Hà Giang",
    description: "Loại trà quý hiếm có hình dáng như móng rồng, hương vị độc đáo của nhựa thông và hoa rừng.",
    images: ["https://picsum.photos/seed/dragontea1/800/800"],
    stock: 25,
    rating: 4.9,
    reviewsCount: 15
  },
  {
    name: "Oolong Kim Tuyên",
    price: 400000,
    category: "Oolong",
    origin: "Lâm Đồng",
    description: "Trà Oolong có vị sữa đặc trưng, hương thơm dịu nhẹ, rất được phái nữ ưa chuộng.",
    images: ["https://picsum.photos/seed/oolong2/800/800"],
    stock: 70,
    rating: 4.7,
    reviewsCount: 35
  },
  {
    name: "Phổ Nhĩ Chín 10 Năm",
    price: 1500000,
    category: "Phổ Nhĩ",
    origin: "Vân Nam",
    description: "Trà Phổ Nhĩ chín đã lên men lâu năm, vị ngọt dịu, nước trà đỏ đậm như rượu vang.",
    images: ["https://picsum.photos/seed/puerh2/800/800"],
    stock: 10,
    rating: 5.0,
    reviewsCount: 8
  },
  {
    name: "Trà Gạo Lứt Huyết Rồng",
    price: 120000,
    category: "Trà thảo mộc",
    origin: "Đồng Tháp",
    description: "Trà gạo lứt rang thơm phức, giàu dinh dưỡng, hỗ trợ giảm cân và thanh lọc cơ thể.",
    images: ["https://picsum.photos/seed/rice1/800/800"],
    stock: 200,
    rating: 4.5,
    reviewsCount: 60
  },
  {
    name: "Chè Đinh Thái Nguyên Cao Cấp",
    price: 1000000,
    category: "Lục trà",
    origin: "Thái Nguyên",
    description: "Được làm từ những mầm trà nhỏ nhất như chiếc đinh, là loại chè xanh cao cấp nhất.",
    images: ["https://picsum.photos/seed/dingtea1/800/800"],
    stock: 20,
    rating: 5.0,
    reviewsCount: 10
  },
  {
    name: "Chè Tươi Lá Già",
    price: 50000,
    category: "Lục trà",
    origin: "Nghệ An",
    description: "Lá chè tươi hái từ vườn, dùng để nấu nước uống hàng ngày, thanh nhiệt và giải khát.",
    images: ["https://picsum.photos/seed/chetuoi/800/800"],
    stock: 500,
    rating: 4.9,
    reviewsCount: 100
  }
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'Tất cả');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const { isAdmin } = useAuth();

  const handleSeed = async () => {
    setIsSeeding(true);
    const productsCol = collection(db, 'products');
    try {
      for (const p of SAMPLE_PRODUCTS) {
        await addDoc(productsCol, p);
      }
      toast.success("Đã thêm 15 sản phẩm mẫu thành công!");
    } catch (error) {
      toast.error("Lỗi khi thêm sản phẩm mẫu.");
      console.error(error);
    } finally {
      setIsSeeding(false);
    }
  };

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
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500">
                Hiển thị <span className="font-bold text-[#1f3d2b]">{filteredProducts.length}</span> sản phẩm
              </p>
              {isAdmin && products.length === 0 && (
                <button
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest hover:opacity-70 disabled:opacity-50"
                >
                  {isSeeding ? "Đang thêm..." : "Thêm 15 sản phẩm mẫu"} <Plus size={14} />
                </button>
              )}
            </div>
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
