import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Package, 
  ArrowLeft,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc 
} from 'firebase/firestore';
import { Product, Category } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { toast } from 'sonner';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: '',
    stock: 0,
    description: '',
    images: ['https://picsum.photos/seed/tea/800/800'],
    origin: '',
    taste: '',
    brewingGuide: '',
    rating: 5,
    reviewsCount: 0
  });
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/shop');
      return;
    }

    const qProducts = query(collection(db, 'products'), orderBy('name', 'asc'));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
    });

    const qCategories = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubscribeCategories = onSnapshot(qCategories, (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(categoriesData);
      if (categoriesData.length > 0 && !newProductForm.category) {
        setNewProductForm(prev => ({ ...prev, category: categoriesData[0].name }));
      }
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
    };
  }, [isAdmin, navigate]);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const handleSave = async (id: string) => {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, editForm);
      setEditingId(null);
      toast.success("Cập nhật sản phẩm thành công!");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Lỗi khi cập nhật sản phẩm.");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), newProductForm);
      setIsAdding(false);
      setNewProductForm({
        name: '',
        price: 0,
        category: categories.length > 0 ? categories[0].name : '',
        stock: 0,
        description: '',
        images: ['https://picsum.photos/seed/tea/800/800'],
        origin: '',
        taste: '',
        brewingGuide: '',
        rating: 5,
        reviewsCount: 0
      });
      toast.success("Đã thêm sản phẩm mới!");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Lỗi khi thêm sản phẩm.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success("Đã xóa sản phẩm.");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Lỗi khi xóa sản phẩm.");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-tea-light">
      <Header />
      
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="space-y-2">
            <Link to="/profile" className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-tea-primary transition-colors mb-2">
              <ArrowLeft size={12} /> Quay lại Profile
            </Link>
            <h1 className="text-3xl font-serif font-bold text-tea-dark">Quản lý sản phẩm</h1>
            <p className="text-sm text-gray-500">Chỉnh sửa thông tin và giá cả của các phẩm trà.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Product Table */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Sản phẩm</th>
                      <th className="px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Danh mục</th>
                      <th className="px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Giá (VNĐ)</th>
                      <th className="px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">Kho</th>
                      <th className="px-4 py-4 text-[9px] font-bold uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <AnimatePresence mode="popLayout">
                      {filteredProducts.map((product) => (
                        <motion.tr 
                          key={product.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              {editingId === product.id ? (
                                <input
                                  type="text"
                                  value={editForm.name}
                                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-tea-dark w-full"
                                />
                              ) : (
                                <span className="text-xs font-bold text-tea-dark">{product.name}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {editingId === product.id ? (
                              <select
                                value={editForm.category}
                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs"
                              >
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-1.5 py-0.5 rounded">
                                {product.category}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                defaultValue={product.price}
                                onBlur={(e) => {
                                  const val = Number(e.target.value);
                                  if (val !== product.price) {
                                    const docRef = doc(db, 'products', product.id);
                                    updateDoc(docRef, { price: val });
                                    toast.success("Đã cập nhật giá!");
                                  }
                                }}
                                className="w-24 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-tea-dark focus:border-tea-primary focus:outline-none"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              defaultValue={product.stock}
                              onBlur={(e) => {
                                const val = Number(e.target.value);
                                if (val !== product.stock) {
                                  const docRef = doc(db, 'products', product.id);
                                  updateDoc(docRef, { stock: val });
                                  toast.success("Đã cập nhật số lượng tồn kho!");
                                }
                              }}
                              className={cn(
                                "w-16 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs focus:border-tea-primary focus:outline-none",
                                product.stock < 10 ? "text-red-500 font-bold" : "text-gray-600"
                              )}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {editingId === product.id ? (
                                <>
                                  <button 
                                    onClick={() => handleSave(product.id)}
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  >
                                    <Save size={14} />
                                  </button>
                                  <button 
                                    onClick={() => setEditingId(null)}
                                    className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    onClick={() => handleEdit(product)}
                                    className="p-1.5 text-gray-400 hover:text-tea-primary hover:bg-white rounded-lg transition-colors"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(product.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              
              {filteredProducts.length === 0 && !loading && (
                <div className="py-20 text-center space-y-4">
                  <Package className="mx-auto text-gray-200" size={48} />
                  <p className="text-xs text-gray-400">Không tìm thấy sản phẩm nào.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <button 
                onClick={() => setIsAdding(true)}
                className="w-full bg-tea-primary text-white py-3.5 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-tea-primary/10 text-xs"
              >
                <Plus size={16} /> Thêm sản phẩm
              </button>

              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tìm kiếm</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Tên sản phẩm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-tea-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Danh mục</label>
                  <div className="grid grid-cols-1 gap-1">
                    <button
                      onClick={() => setSearchQuery('')}
                      className={cn(
                        "text-left px-3 py-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider",
                        searchQuery === ''
                          ? "bg-tea-primary text-white"
                          : "text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      Tất cả
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSearchQuery(cat.name)}
                        className={cn(
                          "text-left px-3 py-2 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider",
                          searchQuery === cat.name
                            ? "bg-tea-primary text-white"
                            : "text-gray-500 hover:bg-gray-50"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-tea-light p-6 rounded-3xl border border-dashed border-gray-200 text-center space-y-2">
              <p className="text-[10px] font-bold text-tea-dark uppercase tracking-widest">Thống kê nhanh</p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-lg font-serif font-bold text-tea-dark">{products.length}</p>
                  <p className="text-[8px] text-gray-400 uppercase font-bold">Sản phẩm</p>
                </div>
                <div>
                  <p className="text-lg font-serif font-bold text-red-500">{products.filter(p => p.stock < 10).length}</p>
                  <p className="text-[8px] text-gray-400 uppercase font-bold">Sắp hết hàng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] p-10 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh] space-y-8 no-scrollbar"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-serif font-bold text-tea-dark">Thêm sản phẩm mới</h2>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tên sản phẩm</label>
                  <input
                    required
                    type="text"
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Giá (VNĐ)</label>
                  <input
                    required
                    type="number"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Danh mục</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Số lượng tồn kho</label>
                  <input
                    required
                    type="number"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mô tả sản phẩm</label>
                  <textarea
                    required
                    rows={4}
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Xuất xứ</label>
                  <input
                    type="text"
                    value={newProductForm.origin}
                    onChange={(e) => setNewProductForm({ ...newProductForm, origin: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hương vị</label>
                  <input
                    type="text"
                    value={newProductForm.taste}
                    onChange={(e) => setNewProductForm({ ...newProductForm, taste: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    className="w-full bg-tea-primary text-white py-5 rounded-full font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl shadow-tea-primary/20"
                  >
                    Thêm sản phẩm
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
