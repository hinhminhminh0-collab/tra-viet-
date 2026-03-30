import { motion } from 'motion/react';
import { ArrowRight, Leaf, Heart, Users, Globe } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-tea-bg">
      <Header />

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 bg-tea-bg/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-bold text-tea-primary uppercase tracking-widest">Câu chuyện thương hiệu</span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-tea-primary leading-tight">
                Lan tỏa tinh hoa <br /> Trà Việt
              </h1>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              Trà Việt ra đời từ niềm đam mê mãnh liệt với những búp trà cổ thụ trên đỉnh núi cao mờ sương. Chúng tôi không chỉ bán trà, chúng tôi kể câu chuyện về văn hóa, con người và sự tĩnh lặng của tâm hồn.
            </p>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-4xl font-serif font-bold text-tea-primary">10+</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Năm kinh nghiệm</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <p className="text-4xl font-serif font-bold text-tea-primary">50+</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Vùng trà cổ thụ</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div>
                <p className="text-4xl font-serif font-bold text-tea-primary">10k+</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Khách hàng tin dùng</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://picsum.photos/seed/about-hero/800/800"
                alt="About Hero"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-tea-primary text-white p-10 rounded-3xl shadow-xl hidden md:block max-w-[300px]">
              <p className="text-xl font-serif italic">"Trà là sự kết nối giữa con người và thiên nhiên."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: <Leaf size={32} />,
              title: "Sứ mệnh",
              desc: "Bảo tồn và phát triển các giống trà cổ thụ quý hiếm, mang giá trị trà Việt vươn tầm thế giới."
            },
            {
              icon: <Heart size={32} />,
              title: "Giá trị cốt lõi",
              desc: "Tận tâm, trung thực và trân trọng từng búp trà. Chúng tôi đặt chất lượng và sức khỏe khách hàng lên hàng đầu."
            },
            {
              icon: <Globe size={32} />,
              title: "Tầm nhìn",
              desc: "Trở thành biểu tượng của văn hóa trà đạo Việt Nam hiện đại, tinh tế và bền vững."
            }
          ].map((item, i) => (
            <div key={i} className="p-10 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 space-y-6">
              <div className="text-tea-primary">{item.icon}</div>
              <h3 className="text-2xl font-serif font-bold text-tea-primary">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 px-6 bg-tea-primary text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">Đội ngũ nghệ nhân <br /> tâm huyết</h2>
            <p className="text-white/60 text-lg leading-relaxed">
              Chúng tôi may mắn được làm việc cùng những nghệ nhân trà hàng đầu, những người đã dành cả đời để lắng nghe tiếng nói của lá trà. Sự tỉ mỉ trong từng công đoạn chế biến là bí quyết tạo nên hương vị đặc trưng của Trà Việt.
            </p>
            <button className="bg-white text-tea-primary px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all">
              Gặp gỡ nghệ nhân
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={`https://picsum.photos/seed/artisan${i}/400/600`}
                  alt={`Artisan ${i}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </section>

      <Footer />
    </div>
  );
}
