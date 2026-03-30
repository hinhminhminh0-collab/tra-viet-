import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Edit, X, Save, Leaf, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types';
import { formatPrice, cn } from '../../lib/utils';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: product.name,
    price: product.price,
    category: product.category,
    imageUrl: product.images[0],
    stock: product.stock
  });
  const [isSaving, setIsSaving] = useState(false);

  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    navigate('/cart');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'products', product.id), {
        name: editData.name,
        price: editData.price,
        category: editData.category,
        images: [editData.imageUrl],
        stock: editData.stock
      });
      toast.success("Cập nhật sản phẩm thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật sản phẩm.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100"
      >
        <Link to={`/product/${product.id}`} className="block relative aspect-[1/1] overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className={cn(
            "absolute top-2 right-2 flex flex-col gap-1.5 transition-all duration-500",
            isAdmin ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
          )}>
            {isAdmin && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
                className="bg-tea-primary text-white p-2 rounded-full shadow-md hover:bg-black transition-colors"
              >
                <Edit size={14} />
              </button>
            )}
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-tea-primary hover:text-white transition-colors">
              <Heart size={14} />
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="bg-white p-2 rounded-full shadow-md hover:bg-tea-primary hover:text-white transition-colors"
            >
              <ShoppingCart size={14} />
            </button>
          </div>
        </Link>

        <div className="p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[7px] uppercase tracking-widest text-gray-400 font-bold">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 text-yellow-500">
              <Star size={8} fill="currentColor" />
              <span className="text-[9px] font-medium text-gray-600">{product.rating}</span>
            </div>
          </div>
          
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-xs font-serif font-bold text-tea-dark hover:opacity-70 transition-opacity line-clamp-1">
              {product.name}
            </h3>
            <p className={cn(
              "text-[9px] font-medium mt-0.5",
              product.stock < 10 ? "text-red-500" : "text-gray-500"
            )}>
              {t('common.stock')}: {product.stock}
            </p>
          </Link>
          
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-xs font-bold text-tea-dark">
              {formatPrice(product.price)}
            </span>
            <button 
              onClick={handleBuyNow}
              className="text-[9px] font-bold text-tea-dark underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              Mua
            </button>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] p-10 shadow-2xl space-y-8 overflow-hidden"
            >
              {/* Decorative Leaf */}
              <div className="absolute -top-10 -right-10 text-tea-dark/5 rotate-12">
                <Leaf size={200} />
              </div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-tea-primary/10 rounded-xl text-tea-primary">
                    <Leaf size={24} />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-tea-dark">Chỉnh sửa sản phẩm</h2>
                </div>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="relative space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-tea-dark uppercase tracking-widest">Tên sản phẩm</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-tea-dark uppercase tracking-widest">Đường dẫn hình ảnh (URL)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={editData.imageUrl}
                      onChange={(e) => setEditData({ ...editData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                    />
                  </div>
                  {editData.imageUrl && (
                    <div className="mt-2 aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                      <img src={editData.imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-tea-dark uppercase tracking-widest">Giá (VNĐ)</label>
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-tea-dark uppercase tracking-widest">Kho</label>
                    <input
                      type="number"
                      value={editData.stock}
                      onChange={(e) => setEditData({ ...editData, stock: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-tea-dark uppercase tracking-widest">Danh mục</label>
                    <select
                      value={editData.category}
                      onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors appearance-none"
                    >
                      <option value="Bạch trà">Bạch trà</option>
                      <option value="Hồng trà">Hồng trà</option>
                      <option value="Lục trà">Lục trà</option>
                      <option value="Oolong">Oolong</option>
                      <option value="Phổ Nhĩ">Phổ Nhĩ</option>
                      <option value="Trà thảo mộc">Trà thảo mộc</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="relative flex gap-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-4 rounded-full border border-gray-200 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-4 bg-tea-primary text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-tea-primary/20"
                >
                  {isSaving ? 'Đang lưu...' : (
                    <>
                      <Save size={16} /> Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
