import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Eye, EyeOff } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Auth() {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: ['hinhminhminh0@gmail.com', 'nghiazet7@gmail.com'].includes(user.email || '') ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        });
      }
      
      toast.success(`Chào mừng trở lại, ${user.displayName}!`);
      navigate('/');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/operation-not-allowed') {
        setShowSetupGuide(true);
        toast.error("Lỗi: Phương thức đăng nhập Google chưa được bật.");
      } else if (error.code === 'auth/unauthorized-domain') {
        setShowSetupGuide(true);
        toast.error("Lỗi: Tên miền này chưa được cấp phép trong Firebase Console.");
      } else {
        toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleGithubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0],
          photoURL: user.photoURL,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }
      
      toast.success(`Chào mừng trở lại, ${user.displayName}!`);
      navigate('/');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/operation-not-allowed') {
        setShowSetupGuide(true);
        toast.error("Lỗi: Phương thức đăng nhập GitHub chưa được bật.");
      } else {
        toast.error("Đăng nhập GitHub thất bại.");
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Vui lòng nhập email để nhận liên kết đặt lại mật khẩu.");
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Hệ thống đã tự động gửi một liên kết đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư (bao gồm cả thư rác).");
      setAuthMode('login');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/user-not-found') {
        toast.error("Không tìm thấy tài khoản với email này.");
      } else {
        toast.error("Không thể gửi email đặt lại mật khẩu. Vui lòng kiểm tra lại email hoặc thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Đăng nhập thành công!");
      } else if (authMode === 'register') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: name,
          role: ['hinhminhminh0@gmail.com', 'nghiazet7@gmail.com'].includes(user.email || '') ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        });
        toast.success("Đăng ký tài khoản thành công!");
      }
      navigate('/');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/operation-not-allowed') {
        setShowSetupGuide(true);
        toast.error("Lỗi: Phương thức Email/Password chưa được bật.");
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error("Email này đã được sử dụng. Vui lòng đăng nhập.");
        setAuthMode('login');
      } else if (error.code === 'auth/invalid-credential') {
        toast.error("Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại từng ký tự hoặc nhấn 'Quên mật khẩu' để đặt lại.");
      } else if (error.code === 'auth/weak-password') {
        toast.error("Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.");
      } else {
        toast.error(error.message || "Có lỗi xảy ra.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tea-bg">
      <Header />

      <section className="pt-40 pb-24 px-6 flex flex-col items-center justify-center gap-8">
        <AnimatePresence>
          {showSetupGuide && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl w-full bg-red-50 border border-red-200 p-8 rounded-[32px] space-y-6"
            >
              <div className="flex items-center gap-4 text-red-600">
                <div className="bg-red-100 p-3 rounded-full">
                  <Lock size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Yêu cầu cấu hình Firebase</h2>
                  <p className="text-sm opacity-80">Bạn cần bật các phương thức đăng nhập trong Firebase Console.</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                <p className="font-medium">Các bước thực hiện:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Truy cập <a href={`https://console.firebase.google.com/project/${auth.app.options.projectId}/authentication/providers`} target="_blank" className="text-blue-600 underline font-bold">Firebase Authentication Console</a></li>
                  <li>Nhấn nút <strong>"Add new provider"</strong></li>
                  <li>Bật các phương thức: <strong>Email/Password</strong>, <strong>Google</strong>, và <strong>GitHub</strong></li>
                  <li>Nhấn <strong>Save</strong> cho mỗi phương thức</li>
                  <li><strong>Quan trọng:</strong> Chuyển sang tab <strong>"Settings"</strong> &rarr; <strong>"Authorized domains"</strong> và thêm tên miền của trang web bạn (ví dụ: <code>ais-pre-cr7ur6kiixelfhmcof3mjr-280884594748.asia-east1.run.app</code>) vào danh sách.</li>
                </ol>
                <p className="bg-white p-4 rounded-xl border border-red-100 italic">
                  "Sau khi bật xong, hãy tải lại trang này và thử đăng nhập lại."
                </p>
              </div>
              
              <button 
                onClick={() => setShowSetupGuide(false)}
                className="w-full py-3 bg-red-600 text-white rounded-full font-bold uppercase tracking-widest text-xs"
              >
                Tôi đã hiểu, đóng thông báo
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100">
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-3xl font-serif font-bold text-tea-primary">
              {authMode === 'login' ? 'Chào mừng trở lại' : authMode === 'register' ? 'Tạo tài khoản mới' : 'Đặt lại mật khẩu'}
            </h1>
            <p className="text-gray-500 text-sm">
              {authMode === 'login' 
                ? 'Đăng nhập để tiếp tục hành trình trà đạo của bạn.' 
                : authMode === 'register' 
                  ? 'Tham gia cộng đồng yêu trà Việt ngay hôm nay.'
                  : 'Nhập email của bạn để nhận liên kết đặt lại mật khẩu tự động.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {authMode === 'forgot-password' ? (
              <motion.form
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-tea-primary uppercase tracking-widest">Email tài khoản</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                    />
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-tea-primary text-white py-5 rounded-full font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl shadow-tea-primary/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Đang gửi...' : 'Gửi mã xác nhận (Link)'}
                  {!isLoading && <ArrowRight size={18} />}
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="w-full text-sm font-bold text-gray-400 hover:text-tea-primary transition-colors"
                >
                  Quay lại đăng nhập
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="auth"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <AnimatePresence mode="wait">
                  {authMode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <label className="text-xs font-bold text-tea-primary uppercase tracking-widest">Họ và tên</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          required
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Nhập tên của bạn..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-tea-primary uppercase tracking-widest">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-tea-primary uppercase tracking-widest">Mật khẩu</label>
                    {authMode === 'login' && (
                      <button 
                        type="button" 
                        onClick={() => setAuthMode('forgot-password')}
                        className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-tea-primary"
                      >
                        Quên mật khẩu?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:border-tea-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-tea-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-tea-primary text-white py-5 rounded-full font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl shadow-tea-primary/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Đang xử lý...' : authMode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 space-y-6">
            {authMode !== 'forgot-password' && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-gray-400">
                    <span className="bg-white px-4">Hoặc đăng nhập với</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all font-bold text-sm"
                  >
                    <Chrome size={20} className="text-red-500" /> Google
                  </button>
                  <button
                    type="button"
                    onClick={handleGithubLogin}
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all font-bold text-sm"
                  >
                    <Github size={20} /> Github
                  </button>
                </div>
              </>
            )}

            <p className="text-center text-sm text-gray-500">
              {authMode === 'login' ? 'Chưa có tài khoản?' : authMode === 'register' ? 'Đã có tài khoản?' : ''}
              {authMode !== 'forgot-password' && (
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="ml-2 font-bold text-tea-primary hover:underline"
                >
                  {authMode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
                </button>
              )}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
