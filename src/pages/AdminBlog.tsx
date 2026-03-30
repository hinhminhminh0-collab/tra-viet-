import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  Tag,
  User as UserIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { Post } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Hướng dẫn',
    image: '',
    tags: ''
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/shop');
      return;
    }

    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, navigate]);

  const handleOpenModal = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        image: post.image,
        tags: post.tags.join(', ')
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        content: '',
        category: 'Hướng dẫn',
        image: '',
        tags: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      authorId: user.uid,
      authorName: user.displayName || user.email,
      createdAt: editingPost ? editingPost.createdAt : serverTimestamp()
    };

    try {
      if (editingPost) {
        await updateDoc(doc(db, 'posts', editingPost.id), postData);
        toast.success("Đã cập nhật bài viết thành công!");
      } else {
        await addDoc(collection(db, 'posts'), postData);
        toast.success("Đã thêm bài viết mới thành công!");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Lỗi khi lưu bài viết.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    try {
      await deleteDoc(doc(db, 'posts', id));
      toast.success("Đã xóa bài viết.");
    } catch (error) {
      toast.error("Lỗi khi xóa bài viết.");
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            <h1 className="text-3xl font-serif font-bold text-tea-dark">Quản lý bài viết</h1>
            <p className="text-sm text-gray-500">Tạo và chỉnh sửa các bài viết kiến thức về trà.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-tea-primary transition-colors shadow-sm"
              />
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="bg-tea-primary text-white p-3.5 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-tea-primary/20"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <motion.div 
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden group"
            >
              <div className="aspect-[16/9] relative overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => handleOpenModal(post)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-tea-primary hover:bg-white transition-all shadow-sm"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-red-600 hover:bg-white transition-all shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-tea-primary text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-xl font-serif font-bold text-tea-dark line-clamp-2 leading-tight">{post.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{post.content}</p>
                <div className="pt-4 flex items-center justify-between border-t border-gray-50">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <UserIcon size={12} /> Admin
                  </div>
                  <div className="flex gap-1">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[8px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && !loading && (
          <div className="py-32 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
              <FileText size={32} className="text-gray-200" />
            </div>
            <p className="text-gray-400 font-medium italic">Không tìm thấy bài viết nào.</p>
          </div>
        )}
      </main>

      <Footer />

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white max-w-4xl w-full p-10 rounded-[40px] shadow-2xl my-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif font-bold text-tea-dark">
                  {editingPost ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <FileText size={14} /> Tiêu đề bài viết
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Nhập tiêu đề..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon size={14} /> URL Hình ảnh
                    </label>
                    <input
                      required
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        Danh mục
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors appearance-none"
                      >
                        <option>Hướng dẫn</option>
                        <option>Văn hóa</option>
                        <option>Sức khỏe</option>
                        <option>Vùng trà</option>
                        <option>Trà cụ</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Tag size={14} /> Tags
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="Tag1, Tag2..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      Nội dung bài viết
                    </label>
                    <textarea
                      required
                      rows={8}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Nhập nội dung chi tiết..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-tea-primary transition-colors resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 border-2 border-gray-100 text-gray-400 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-tea-primary text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-lg shadow-tea-primary/20 flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      {editingPost ? 'Cập nhật' : 'Lưu bài viết'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
