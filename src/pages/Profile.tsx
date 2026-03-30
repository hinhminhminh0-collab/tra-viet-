import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User as UserIcon, Package, Settings, LogOut, ChevronRight, Heart, MapPin, Bell, Shield, Key, Eye, EyeOff, FileText, Layers } from 'lucide-react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, updatePassword, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { User } from '../types';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showReauthModal, setShowReauthModal] = useState(false);
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    if (newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setIsUpdating(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      toast.success("Đổi mật khẩu thành công!");
      setNewPassword('');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/requires-recent-login') {
        setShowReauthModal(true);
        toast.info("Vui lòng xác nhận mật khẩu hiện tại để tiếp tục.");
      } else {
        toast.error("Lỗi khi đổi mật khẩu. Vui lòng thử lại.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReauthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !auth.currentUser.email) return;

    setIsUpdating(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // After successful re-auth, try updating password again
      await updatePassword(auth.currentUser, newPassword);
      
      toast.success("Xác thực thành công và đã đổi mật khẩu!");
      setShowReauthModal(false);
      setNewPassword('');
      setCurrentPassword('');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/invalid-credential') {
        toast.error("Mật khẩu hiện tại không chính xác.");
      } else {
        toast.error("Lỗi xác thực. Vui lòng thử lại.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetAdminPassword = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.");
    } catch (error) {
      toast.error("Lỗi khi gửi email đặt lại mật khẩu.");
    }
  };

  if (isLoading) return <div className="pt-32 text-center">Đang tải thông tin...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-tea-bg">
      <Header />

      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 text-center space-y-4">
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-tea-primary/10">
              <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=1f3d2b&color=fff`} alt={user.displayName} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-serif font-bold text-tea-primary">{user.displayName || 'Khách hàng'}</h2>
              <p className="text-xs text-gray-400 font-medium">{user.email}</p>
            </div>
            <div className="pt-4">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-tea-primary/5 text-tea-primary px-3 py-1 rounded-full">
                {user.role === 'admin' ? 'Quản trị viên chính' : 'Thành viên'}
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
                    <span className="text-sm font-bold text-tea-dark">Quản lý đơn hàng</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/admin/products')}
                  className="w-full flex items-center justify-between p-4 rounded-2xl transition-all text-blue-600 bg-blue-50 hover:bg-blue-100"
                >
                  <div className="flex items-center gap-3">
                    <Settings size={18} />
                    <span className="text-sm font-bold text-tea-dark">Quản lý sản phẩm</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="w-full flex items-center justify-between p-4 rounded-2xl transition-all text-purple-600 bg-purple-50 hover:bg-purple-100"
                >
                  <div className="flex items-center gap-3">
                    <UserIcon size={18} />
                    <span className="text-sm font-bold text-tea-dark">Quản lý người dùng</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/admin/blog')}
                  className="w-full flex items-center justify-between p-4 rounded-2xl transition-all text-orange-600 bg-orange-50 hover:bg-orange-100"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} />
                    <span className="text-sm font-bold text-tea-dark">Quản lý bài viết</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/admin/categories')}
                  className="w-full flex items-center justify-between p-4 rounded-2xl transition-all text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                >
                  <div className="flex items-center gap-3">
                    <Layers size={18} />
                    <span className="text-sm font-bold text-tea-dark">Quản lý danh mục</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
            {[
              { id: 'profile', icon: <UserIcon size={18} />, label: 'Thông tin cá nhân' },
              { id: 'orders', icon: <Package size={18} />, label: 'Đơn hàng của tôi' },
              { id: 'security', icon: <Shield size={18} />, label: 'Bảo mật & Mật khẩu' },
              { id: 'wishlist', icon: <Heart size={18} />, label: 'Sản phẩm yêu thích' },
              { id: 'address', icon: <MapPin size={18} />, label: 'Địa chỉ nhận hàng' },
              { id: 'settings', icon: <Settings size={18} />, label: 'Cài đặt' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl transition-all",
                  activeTab === item.id ? "bg-tea-primary text-white" : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                <ChevronRight size={16} className={activeTab === item.id ? "opacity-100" : "opacity-0"} />
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
          {activeTab === 'profile' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user.role === 'admin' ? (
                  <>
                    {[
                      { label: 'Tổng đơn hàng', value: '128', color: 'bg-blue-50 text-blue-600' },
                      { label: 'Doanh thu', value: '45.2M', color: 'bg-green-50 text-green-600' },
                      { label: 'Người dùng', value: '1,024', color: 'bg-purple-50 text-purple-600' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex flex-col items-center gap-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-3xl font-serif font-bold text-tea-primary">{stat.value}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      { label: 'Đơn hàng', value: '0', color: 'bg-blue-50 text-blue-600' },
                      { label: 'Tích điểm', value: '1,200', color: 'bg-yellow-50 text-yellow-600' },
                      { label: 'Voucher', value: '3', color: 'bg-green-50 text-green-600' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 flex flex-col items-center gap-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-3xl font-serif font-bold text-tea-primary">{stat.value}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 space-y-8">
                <h3 className="text-2xl font-serif font-bold text-tea-primary border-b border-gray-100 pb-6">Thông tin chi tiết</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Họ và tên</label>
                    <p className="text-lg font-medium text-tea-primary">{user.displayName || 'Chưa cập nhật'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</label>
                    <p className="text-lg font-medium text-tea-primary">{user.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ngày tham gia</label>
                    <p className="text-lg font-medium text-tea-primary">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Chưa rõ'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vai trò</label>
                    <p className="text-lg font-medium text-tea-primary capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 space-y-8">
              <h3 className="text-2xl font-serif font-bold text-tea-primary border-b border-gray-100 pb-6">Đơn hàng của tôi</h3>
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <Package size={32} className="text-gray-200" />
                </div>
                <p className="text-gray-400 font-medium italic">Bạn chưa có đơn hàng nào.</p>
                <button onClick={() => navigate('/shop')} className="text-sm font-bold text-tea-primary underline underline-offset-4">
                  Mua sắm ngay
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 space-y-8">
              <h3 className="text-2xl font-serif font-bold text-tea-primary border-b border-gray-100 pb-6">Bảo mật tài khoản</h3>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-tea-primary flex items-center gap-2">
                    <Key size={20} /> Đổi mật khẩu
                  </h4>
                  <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mật khẩu mới</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-6 pr-12 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-tea-primary transition-colors"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <button
                      disabled={isUpdating}
                      type="submit"
                      className="w-full bg-tea-primary text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-lg shadow-tea-primary/20"
                    >
                      {isUpdating ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </button>
                  </form>
                </div>

                <div className="pt-8 border-t border-gray-100 space-y-4">
                  <h4 className="text-lg font-bold text-tea-primary">Quên mật khẩu?</h4>
                  <p className="text-sm text-gray-500">
                    Nếu bạn quên mật khẩu hoặc muốn đặt lại qua email, hãy nhấn nút bên dưới.
                  </p>
                  <button
                    onClick={handleResetAdminPassword}
                    className="px-8 py-4 border-2 border-tea-primary text-tea-primary rounded-full font-bold uppercase tracking-widest text-xs hover:bg-tea-primary hover:text-white transition-all"
                  >
                    Gửi email đặt lại mật khẩu
                  </button>
                </div>

                {['hinhminhminh0@gmail.com', 'nghiazet7@gmail.com'].includes(user.email || '') && (
                  <div className="pt-8 border-t border-red-100 space-y-4">
                    <h4 className="text-lg font-bold text-red-600">Khu vực Admin</h4>
                    <p className="text-sm text-gray-500 italic">
                      Lưu ý: Để reset mật khẩu về "admin123", bạn có thể nhập "admin123" vào ô đổi mật khẩu ở trên và nhấn cập nhật.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Re-authentication Modal */}
      {showReauthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white max-w-md w-full p-10 rounded-[40px] shadow-2xl space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto">
                <Shield size={32} className="text-yellow-600" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-tea-primary">Xác nhận danh tính</h3>
              <p className="text-sm text-gray-500">
                Vì lý do bảo mật, vui lòng nhập mật khẩu hiện tại của bạn để thực hiện thay đổi này.
              </p>
            </div>

            <form onSubmit={handleReauthenticate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-tea-primary uppercase tracking-widest">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input
                    required
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-6 pr-12 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-tea-primary transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowReauthModal(false)}
                  className="flex-1 py-4 border-2 border-gray-100 text-gray-400 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all"
                >
                  Hủy
                </button>
                <button
                  disabled={isUpdating}
                  type="submit"
                  className="flex-1 bg-tea-primary text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-lg shadow-tea-primary/20"
                >
                  {isUpdating ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
