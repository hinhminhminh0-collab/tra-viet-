import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const BLOG_POSTS = [
  {
    id: '1',
    title: 'Nghệ thuật pha trà Shan Tuyết cổ thụ đúng cách',
    excerpt: 'Làm thế nào để đánh thức hương vị tinh túy nhất của những búp trà Shan Tuyết hàng trăm năm tuổi?',
    image: 'https://picsum.photos/seed/blog1/800/600',
    category: 'Hướng dẫn',
    author: 'Trần Văn Trà',
    date: '25/03/2026'
  },
  {
    id: '2',
    title: 'Văn hóa trà Việt: Từ truyền thống đến hiện đại',
    excerpt: 'Khám phá sự chuyển mình của văn hóa trà Việt qua các thời kỳ và cách người trẻ đón nhận trà đạo.',
    image: 'https://picsum.photos/seed/blog2/800/600',
    category: 'Văn hóa',
    author: 'Lê Thị Diệp',
    date: '20/03/2026'
  },
  {
    id: '3',
    title: 'Lợi ích sức khỏe bất ngờ từ việc uống trà mỗi ngày',
    excerpt: 'Trà không chỉ là thức uống thư giãn mà còn là liều thuốc quý cho sức khỏe và tâm hồn.',
    image: 'https://picsum.photos/seed/blog3/800/600',
    category: 'Sức khỏe',
    author: 'Bác sĩ Minh',
    date: '15/03/2026'
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      <Header />

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 bg-[#1f3d2b] text-white">
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
          {BLOG_POSTS.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
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
                  <span className="text-[#1f3d2b]">{post.category}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#1f3d2b] group-hover:opacity-70 transition-opacity leading-tight">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <User size={14} /> {post.author}
                  </div>
                  <button className="text-xs font-bold text-[#1f3d2b] flex items-center gap-2 hover:gap-3 transition-all">
                    Đọc tiếp <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6 bg-[#1f3d2b]/5">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          <h2 className="text-3xl font-serif font-bold text-[#1f3d2b]">Chủ đề phổ biến</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Hướng dẫn pha trà', 'Văn hóa trà', 'Sức khỏe', 'Vùng trà', 'Trà cụ', 'Quà tặng'].map(cat => (
              <button key={cat} className="px-8 py-3 rounded-full bg-white border border-gray-100 text-sm font-medium text-[#1f3d2b] hover:bg-[#1f3d2b] hover:text-white transition-all shadow-sm">
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
