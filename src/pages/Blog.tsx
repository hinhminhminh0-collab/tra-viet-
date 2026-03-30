import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Post } from '../types';

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
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
  }, []);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-tea-bg">
      <Header />

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 bg-tea-primary text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold">Kiến thức Trà Việt</h1>
            <p className="text-white/60 text-lg">
              Nơi chia sẻ những câu chuyện, kinh nghiệm và niềm đam mê với trà đạo Việt Nam.
            </p>
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>
          <div className="hidden md:block w-72 h-72 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-56 h-56 bg-white/10 rounded-full border border-white/20 flex items-center justify-center">
              <div className="w-40 h-40 bg-white/20 rounded-full border border-white/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Blog List */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {loading ? (
            <div className="col-span-full text-center py-20 text-gray-400">Đang tải bài viết...</div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group space-y-6"
              >
                <div className="aspect-[16/10] rounded-3xl overflow-hidden shadow-lg">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span className="text-tea-primary">{post.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> 
                      {post.createdAt ? (typeof post.createdAt === 'string' ? new Date(post.createdAt).toLocaleDateString('vi-VN') : (post.createdAt as any).toDate().toLocaleDateString('vi-VN')) : 'Chưa rõ'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-tea-primary group-hover:opacity-70 transition-opacity leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {post.content}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                      <User size={14} /> Admin
                    </div>
                    <button className="text-xs font-bold text-tea-primary flex items-center gap-2 hover:gap-3 transition-all">
                      Đọc tiếp <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400 italic">Không tìm thấy bài viết nào.</div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6 bg-tea-primary/5">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          <h2 className="text-3xl font-serif font-bold text-tea-primary">Chủ đề phổ biến</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Hướng dẫn pha trà', 'Văn hóa trà', 'Sức khỏe', 'Vùng trà', 'Trà cụ', 'Quà tặng'].map(cat => (
              <button key={cat} className="px-8 py-3 rounded-full bg-white border border-gray-100 text-sm font-medium text-tea-primary hover:bg-tea-primary hover:text-white transition-all shadow-sm">
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
