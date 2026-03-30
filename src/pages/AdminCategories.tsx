import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  ArrowLeft,
  Image as ImageIcon,
  Layers
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
import { Category } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Category>>({});
  const [newCategoryForm, setNewCategoryForm] = useState<Partial<Category>>({
    name: '',
    description: '',
    image: 'https://picsum.photos/seed/category/800/800'
  });
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/shop');
      return;
    }

    const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(categoriesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, navigate]);

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditForm(category);
  };

  const handleSave = async (id: string) => {
    try {
      const docRef = doc(db, 'categories', id);
      await updateDoc(docRef, editForm);
      setEditingId(null);
      toast.success("Cập nhật danh mục thành công!");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Lỗi khi cập nhật danh mục.");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'categories'), newCategoryForm);
      setIsAdding(false);
      setNewCategoryForm({
        name: '',
        description: '',
        image: 'https://picsum.photos/seed/category/800/800'
      });
      toast.success("Đã thêm danh mục mới!");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Lỗi khi thêm danh mục.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      toast.success("Đã xóa danh mục.");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Lỗi khi xóa danh mục.");
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-3xl font-serif font-bold text-tea-dark">Quản lý danh mục</h1>
            <p className="text-sm text-gray-500">Quản lý các loại trà và phân loại sản phẩm.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-tea-primary transition-colors shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-tea-primary text-white p-3.5 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-tea-primary/20"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => (
            <motion.div 
              key={category.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden group"
            >
              <div className="aspect-[16/9] relative overflow-hidden">
                <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => handleEdit(category)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-tea-primary hover:bg-white transition-all shadow-sm"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-red-600 hover:bg-white transition-all shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-8 space-y-4">
                {editingId === category.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-tea-dark"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-500 resize-none"
                      rows={3}
                    />
                    <input
                      type="text"
                      value={editForm.image}
                      onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-[10px] text-gray-400"
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleSave(category.id)}
                        className="flex-1 bg-tea-primary text-white py-2 rounded-xl text-xs font-bold"
                      >
                        Lưu
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gray-100 text-gray-500 py-2 rounded-xl text-xs font-bold"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-serif font-bold text-tea-dark">{category.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{category.description}</p>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCategories.length === 0 && !loading && (
          <div className="py-32 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
              <Layers size={32} className="text-gray-200" />
            </div>
            <p className="text-gray-400 font-medium italic">Không tìm thấy danh mục nào.</p>
          </div>
        )}
      </main>

      <Footer />

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white max-w-md w-full p-10 rounded-[40px] shadow-2xl space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-serif font-bold text-tea-dark">Thêm danh mục</h2>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddCategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tên danh mục</label>
                  <input
                    required
                    type="text"
                    value={newCategoryForm.name}
                    onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })}
                    placeholder="VD: Bạch trà"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mô tả</label>
                  <textarea
                    required
                    rows={3}
                    value={newCategoryForm.description}
                    onChange={(e) => setNewCategoryForm({ ...newCategoryForm, description: e.target.value })}
                    placeholder="Mô tả ngắn về danh mục..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={14} /> URL Hình ảnh
                  </label>
                  <input
                    required
                    type="url"
                    value={newCategoryForm.image}
                    onChange={(e) => setNewCategoryForm({ ...newCategoryForm, image: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-tea-primary text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-lg shadow-tea-primary/20"
                >
                  Thêm danh mục
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
