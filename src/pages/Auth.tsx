import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
          role: user.email === 'hinhminhminh0@gmail.com' ? 'admin' : 'user',
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
      } else {
        toast.error("Đăng nhập Google thất bại.");
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

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Vui lòng nhập email để đặt lại mật khẩu.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.");
    } catch (error: any) {
      console.error(error);
      toast.error("Không thể gửi email đặt lại mật khẩu. Vui lòng kiểm tra lại email.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Đăng nhập thành công!");
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: name,
          role: 'user',
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
        setIsLogin(true);
      } else if (error.code === 'auth/invalid-credential') {
        toast.error("Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại hoặc nhấn 'Quên mật khẩu'.");
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
    <div className="min-h-screen bg-[#fcfbf7]">
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
                  <li>Truy cập <a href="https://console.firebase.google.com/project/gen-lang-client-0794199035/authentication/providers" target="_blank" className="text-blue-600 underline font-bold">Firebase Authentication Console</a></li>
                  <li>Nhấn nút <strong>"Add new provider"</strong></li>
                  <li>Bật các phương thức: <strong>Email/Password</strong>, <strong>Google</strong>, và <strong>GitHub</strong></li>
                  <li>Nhấn <strong>Save</strong> cho mỗi phương thức</li>
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
            <h1 className="text-3xl font-serif font-bold text-[#1f3d2b]">
              {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Đăng nhập để tiếp tục hành trình trà đạo của bạn.' : 'Tham gia cộng đồng yêu trà Việt ngay hôm nay.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold text-[#1f3d2b] uppercase tracking-widest">Họ và tên</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nhập tên của bạn..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-[#1f3d2b] transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1f3d2b] uppercase tracking-widest">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-[#1f3d2b] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1f3d2b] uppercase tracking-widest">Mật khẩu</label>
                {isLogin && (
                  <button 
                    type="button" 
                    onClick={handleResetPassword}
                    className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#1f3d2b]"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-[#1f3d2b] transition-colors"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-[#1f3d2b] text-white py-5 rounded-full font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl shadow-[#1f3d2b]/20 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Đăng ký'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 space-y-6">
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

            <p className="text-center text-sm text-gray-500">
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-bold text-[#1f3d2b] hover:underline"
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
              </button>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
