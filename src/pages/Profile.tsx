import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User as UserIcon, Package, Settings, LogOut, ChevronRight, Heart, MapPin, Bell } from 'lucide-react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { User } from '../types';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } else {
        navigate('/auth');
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Đã đăng xuất thành công.");
      navigate('/');
    } catch (error) {
      toast.error("Lỗi khi đăng xuất.");
    }
  };

  if (isLoading) return <div className="pt-32 text-center">Đang tải thông tin...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      <Header />

      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 text-center space-y-4">
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-[#1f3d2b]/10">
              <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=1f3d2b&color=fff`} alt={user.displayName} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-serif font-bold text-[#1f3d2b]">{user.displayName || 'Khách hàng'}</h2>
              <p className="text-xs text-gray-400 font-medium">{user.email}</p>
            </div>
            <div className="pt-4">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-[#1f3d2b]/5 text-[#1f3d2b] px-3 py-1 rounded-full">
                Thành viên {user.role === 'admin' ? 'Quản trị' : 'Bạc'}
              </span>
            </div>
          </div>

          <nav className="bg-white p-4 rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
            {user.role === 'admin' && (
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="w-full flex items-center justify-between p-4 rounded-2xl transition-all text-red-600 bg-red-50 hover:bg-red-100"
                >
                  <div className="flex items-center gap-3">
                    <Package size={18} />
                    <span className="text-sm font-bold">Quản lý đơn hàng</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/admin/products')}
                  className="w-full flex items-center justify-between p-4 rounded-2xl transition-all text-blue-600 bg-blue-50 hover:bg-blue-100"
                >
                  <div className="flex items-center gap-3">
                    <Settings size={18} />
                    <span className="text-sm font-bold">Quản lý sản phẩm</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
            {[
              { icon: <UserIcon size={18} />, label: 'Thông tin cá nhân', active: true },
              { icon: <Package size={18} />, label: 'Đơn hàng của tôi' },
              { icon: <Heart size={18} />, label: 'Sản phẩm yêu thích' },
              { icon: <MapPin size={18} />, label: 'Địa chỉ nhận hàng' },
              { icon: <Bell size={18} />, label: 'Thông báo' },
              { icon: <Settings size={18} />, label: 'Cài đặt' },
            ].map((item, i) => (
              <button
                key={i}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all",
                  item.active ? "bg-[#1f3d2b] text-white" : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                <ChevronRight size={16} className={item.active ? "opacity-100" : "opacity-0"} />
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all mt-4"
            >
              <LogOut size={18} />
              <span className="text-sm font-bold">Đăng xuất</span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Đơn hàng', value: '0', color: 'bg-blue-50 text-blue-600' },
              { label: 'Tích điểm', value: '1,200', color: 'bg-yellow-50 text-yellow-600' },
              { label: 'Voucher', value: '3', color: 'bg-green-50 text-green-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex flex-col items-center gap-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-serif font-bold text-[#1f3d2b]">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 space-y-8">
            <h3 className="text-2xl font-serif font-bold text-[#1f3d2b] border-b border-gray-100 pb-6">Đơn hàng gần đây</h3>
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Package size={32} className="text-gray-200" />
              </div>
              <p className="text-gray-400 font-medium italic">Bạn chưa có đơn hàng nào.</p>
              <button onClick={() => navigate('/shop')} className="text-sm font-bold text-[#1f3d2b] underline underline-offset-4">
                Mua sắm ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
