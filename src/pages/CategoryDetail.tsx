import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Leaf, ShoppingBag } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ui/ProductCard';
import { Product, Category } from '../types';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { ProductSkeleton } from '../components/ui/Loading';

export default function CategoryDetail() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      try {
        // Fetch category details
        const categoryDoc = await getDoc(doc(db, 'categories', id));
        if (categoryDoc.exists()) {
          const catData = { id: categoryDoc.id, ...categoryDoc.data() } as Category;
          setCategory(catData);

          // Fetch products for this category
          // Note: In Shop.tsx, products have a 'category' field which is the category NAME string.
          // We should check if it's name or ID. Based on Shop.tsx line 93: p.category === selectedCategory
          // And selectedCategory is set from cat.name in line 218.
          // So we fetch by category name.
          const q = query(
            collection(db, 'products'),
            where('category', '==', catData.name)
          );
          
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Product[];
            setProducts(productsData);
            setLoading(false);
          });

          return () => unsubscribe();
        } else {
          setError("Không tìm thấy danh mục này.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching category detail:", err);
        setError("Đã có lỗi xảy ra khi tải dữ liệu.");
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-tea-bg">
        <Header />
        <div className="pt-40 pb-20 px-6 text-center space-y-6">
          <h1 className="text-3xl font-serif font-bold text-tea-primary">{error}</h1>
          <Link to="/shop" className="inline-flex items-center gap-2 text-tea-primary font-bold border-b-2 border-tea-primary pb-1">
            <ArrowLeft size={18} /> Quay lại cửa hàng
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tea-bg">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <img 
            src={category?.image || "https://picsum.photos/seed/tea/1920/1080"} 
            alt="" 
            className="w-full h-full object-cover blur-xl"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-1/3 aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl"
            >
              <img 
                src={category?.image} 
                alt={category?.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-tea-primary uppercase tracking-widest hover:opacity-70 transition-opacity">
                  <ArrowLeft size={14} /> Tất cả danh mục
                </Link>
                <h1 className="text-5xl md:text-6xl font-serif font-bold text-tea-primary leading-tight">
                  {category?.name}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                  {category?.description}
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center md:justify-start gap-4 pt-4"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                  <ShoppingBag size={16} className="text-tea-primary" />
                  <span className="text-sm font-medium text-gray-600">{products.length} Sản phẩm</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                  <Leaf size={16} className="text-tea-primary" />
                  <span className="text-sm font-medium text-gray-600">100% Tự nhiên</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 px-6 bg-white rounded-t-[60px] shadow-2xl -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex items-center justify-between border-b border-gray-100 pb-8">
            <h2 className="text-2xl font-serif font-bold text-tea-primary">Sản phẩm trong danh mục</h2>
            <div className="text-sm text-gray-400">
              Hiển thị {products.length} kết quả
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="text-6xl">🍃</div>
              <h3 className="text-xl font-serif font-bold text-tea-primary">Chưa có sản phẩm nào</h3>
              <p className="text-gray-500">Danh mục này hiện đang được cập nhật sản phẩm mới.</p>
              <Link to="/shop" className="inline-block bg-tea-primary text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest">
                Tiếp tục mua sắm
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
