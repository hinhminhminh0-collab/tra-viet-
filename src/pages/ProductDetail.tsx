import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronRight, 
  Minus, 
  Plus, 
  Leaf, 
  Clock, 
  Thermometer, 
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/ui/ProductCard';
import { Product } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, limit, getDocs, updateDoc } from 'firebase/firestore';
import Loading from '../components/ui/Loading';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(productData);
          setActiveImage(0);
          
          // Fetch related products
          const q = query(
            collection(db, 'products'), 
            where('category', '==', productData.category),
            limit(5)
          );
          const relatedSnap = await getDocs(q);
          const related = relatedSnap.docs
            .map(d => ({ id: d.id, ...d.data() } as Product))
            .filter(p => p.id !== id);
          setRelatedProducts(related);
        } else {
          toast.error("Không tìm thấy sản phẩm.");
          navigate('/shop');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Lỗi khi tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  useEffect(() => {
    if (product) {
      setNewPrice(product.price);
    }
  }, [product]);

  if (loading) return <Loading />;
  if (!product) return null;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const handleUpdatePrice = async () => {
    if (!id || !product) return;
    setIsUpdating(true);
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, { price: newPrice });
      setProduct({ ...product, price: newPrice });
      setIsEditingPrice(false);
      toast.success("Cập nhật giá thành công!");
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("Lỗi khi cập nhật giá.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-tea-light">
      <Header />

      {/* Breadcrumbs */}
      <nav className="pt-28 pb-6 px-6 max-w-7xl mx-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
        <Link to="/" className="hover:text-tea-primary transition-colors">Trang chủ</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-tea-primary transition-colors">Cửa hàng</Link>
        <ChevronRight size={12} />
        <span className="text-tea-dark/60">{product.name}</span>
      </nav>

      <section className="py-12 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-6">
          <motion.div
            layoutId={`product-image-${product.id}`}
            className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white"
          >
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "w-24 aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0",
                  activeImage === i ? "border-tea-primary scale-105" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-tea-primary uppercase tracking-[0.2em] bg-tea-primary/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-red-500 transition-colors"><Heart size={20} /></button>
                <button className="text-gray-400 hover:text-tea-primary transition-colors"><Share2 size={20} /></button>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-tea-dark leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                ))}
                <span className="ml-2 text-sm font-bold text-gray-700">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-400">({product.reviewsCount} đánh giá)</span>
            </div>
            
            <div className="flex items-center gap-4 pt-2">
              {isAdmin ? (
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    defaultValue={product.price}
                    onBlur={async (e) => {
                      const val = Number(e.target.value);
                      if (val !== product.price) {
                        try {
                          const docRef = doc(db, 'products', product.id);
                          await updateDoc(docRef, { price: val });
                          toast.success("Đã cập nhật giá!");
                        } catch (error) {
                          console.error("Error updating price:", error);
                          toast.error("Lỗi khi cập nhật giá.");
                        }
                      }
                    }}
                    className="w-48 bg-white border border-tea-primary/30 rounded-xl px-4 py-2 text-3xl font-bold text-tea-primary focus:border-tea-primary focus:ring-2 focus:ring-tea-primary/20 focus:outline-none transition-all"
                  />
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">VNĐ</span>
                </div>
              ) : (
                <div className="text-3xl font-bold text-tea-primary">
                  {formatPrice(product.price)}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <MapPin className="text-tea-primary" size={20} />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Xuất xứ</p>
                <p className="text-sm font-bold text-tea-dark">{product.origin}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <Leaf className="text-tea-primary" size={20} />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Hương vị</p>
                <p className="text-sm font-bold text-tea-dark">{product.taste?.split(',')[0] || 'Đang cập nhật'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center border border-gray-200 rounded-full p-1 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors text-tea-dark"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-bold text-tea-dark">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors text-tea-dark"
                >
                  <Plus size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-400 font-medium">
                {product.stock > 0 ? `Còn ${product.stock} sản phẩm trong kho` : 'Hết hàng'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-tea-primary text-white py-4 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-opacity-90 transition-all shadow-xl shadow-tea-primary/20"
              >
                <ShoppingCart size={20} />
                Thêm vào giỏ hàng
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-white text-tea-dark border-2 border-tea-dark py-4 rounded-full font-bold uppercase tracking-widest hover:bg-tea-dark hover:text-white transition-all"
              >
                Mua ngay
              </button>
            </div>
          </div>

          <div className="pt-8 space-y-6">
            <div className="flex gap-8 border-b border-gray-100">
              {['description', 'brewing', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-4 text-xs font-bold uppercase tracking-widest transition-all relative",
                    activeTab === tab ? "text-tea-primary" : "text-gray-400 hover:text-tea-dark"
                  )}
                >
                  {tab === 'description' ? 'Mô tả' : tab === 'brewing' ? 'Cách pha' : 'Đánh giá'}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-tea-primary" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div
                    key="desc"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-gray-600 leading-relaxed space-y-4"
                  >
                    <p>{product.description}</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 size={16} className="text-tea-primary" />
                        <span>100% trà sạch tự nhiên, không hóa chất</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 size={16} className="text-tea-primary" />
                        <span>Thu hái thủ công từ cây trà cổ thụ</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 size={16} className="text-tea-primary" />
                        <span>Đóng gói hút chân không bảo quản hương vị</span>
                      </li>
                    </ul>
                  </motion.div>
                )}

                {activeTab === 'brewing' && (
                  <motion.div
                    key="brewing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-2xl bg-white border border-gray-100">
                        <Thermometer className="mx-auto text-tea-primary mb-2" size={24} />
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Nhiệt độ</p>
                        <p className="text-sm font-bold text-tea-dark">{product.brewingGuide?.match(/\d+ độ C/)?.[0] || '90°C'}</p>
                      </div>
                      <div className="text-center p-4 rounded-2xl bg-white border border-gray-100">
                        <Clock className="mx-auto text-tea-primary mb-2" size={24} />
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Thời gian</p>
                        <p className="text-sm font-bold text-tea-dark">30-60s</p>
                      </div>
                      <div className="text-center p-4 rounded-2xl bg-white border border-gray-100">
                        <Leaf className="mx-auto text-tea-primary mb-2" size={24} />
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Lượng trà</p>
                        <p className="text-sm font-bold text-tea-dark">5g / 200ml</p>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed italic">
                      "{product.brewingGuide || 'Đang cập nhật hướng dẫn pha trà.'}"
                    </p>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {[1, 2].map(i => (
                      <div key={i} className="space-y-2 border-b border-gray-50 pb-4">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-tea-dark">Nguyễn Văn A</p>
                          <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Trà rất thơm, vị ngọt hậu sâu lắng. Giao hàng nhanh và đóng gói rất cẩn thận. Sẽ ủng hộ shop dài dài!</p>
                        <p className="text-[10px] text-gray-400">20/03/2026</p>
                      </div>
                    ))}
                    <button className="text-xs font-bold text-tea-dark uppercase tracking-widest hover:opacity-70">
                      Xem tất cả đánh giá
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-serif font-bold text-tea-dark">Sản phẩm tương tự</h2>
            <Link to="/shop" className="text-sm font-bold text-tea-primary flex items-center gap-2 hover:opacity-70 transition-opacity">
              Xem tất cả <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.length > 0 ? (
              relatedProducts.slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              <p className="text-gray-400 italic">Không có sản phẩm tương tự.</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
