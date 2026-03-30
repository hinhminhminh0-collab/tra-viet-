import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Cảm ơn bạn đã gửi tin nhắn! Chúng tôi sẽ liên hệ lại sớm nhất.");
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      <Header />

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 bg-[#1f3d2b] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Liên hệ với Trà Việt</h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và chia sẻ niềm đam mê trà đạo cùng bạn.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-serif font-bold text-[#1f3d2b]">Thông tin liên hệ</h2>
            <p className="text-gray-500 leading-relaxed">
              Hãy ghé thăm không gian trà đạo của chúng tôi hoặc liên hệ qua các kênh dưới đây để được tư vấn tốt nhất.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="p-4 rounded-2xl bg-[#1f3d2b]/5 text-[#1f3d2b]">
                <MapPin size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Địa chỉ</p>
                <p className="text-lg font-bold text-[#1f3d2b]">123 Tân Cương, Thái Nguyên, Việt Nam</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="p-4 rounded-2xl bg-[#1f3d2b]/5 text-[#1f3d2b]">
                <Phone size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Điện thoại</p>
                <p className="text-lg font-bold text-[#1f3d2b]">0898992654</p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="p-4 rounded-2xl bg-[#1f3d2b]/5 text-[#1f3d2b]">
                <Mail size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</p>
                <p className="text-lg font-bold text-[#1f3d2b]">contact@traviet.com</p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-wrap items-center gap-6">
            <button className="flex items-center gap-2 bg-[#25D366] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all">
              <MessageCircle size={20} /> Zalo: 0898992654
            </button>
            <button className="flex items-center gap-2 bg-[#0088cc] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all">
              <Send size={20} /> Telegram
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-10 md:p-12 rounded-[40px] shadow-2xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1f3d2b] uppercase tracking-widest">Họ và tên</label>
              <input
                required
                type="text"
                placeholder="Nhập tên của bạn..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#1f3d2b] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1f3d2b] uppercase tracking-widest">Email</label>
              <input
                required
                type="email"
                placeholder="email@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#1f3d2b] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1f3d2b] uppercase tracking-widest">Chủ đề</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#1f3d2b] transition-colors">
                <option>Tư vấn sản phẩm</option>
                <option>Hợp tác kinh doanh</option>
                <option>Góp ý dịch vụ</option>
                <option>Khác</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1f3d2b] uppercase tracking-widest">Tin nhắn</label>
              <textarea
                required
                rows={5}
                placeholder="Bạn muốn nhắn nhủ điều gì..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#1f3d2b] transition-colors resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-[#1f3d2b] text-white py-5 rounded-full font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl shadow-[#1f3d2b]/20"
            >
              Gửi tin nhắn
            </button>
          </form>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto h-[500px] rounded-[40px] overflow-hidden shadow-xl border border-gray-100 bg-gray-100 relative">
          <img
            src="https://picsum.photos/seed/map/1200/500?blur=1"
            alt="Map Placeholder"
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 text-center space-y-2">
              <MapPin className="mx-auto text-[#1f3d2b]" size={32} />
              <p className="font-bold text-[#1f3d2b]">TRÀ VIỆT SHOWROOM</p>
              <p className="text-xs text-gray-500">Mở cửa: 8:00 - 21:00 hàng ngày</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
