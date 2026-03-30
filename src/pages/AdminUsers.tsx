import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Trash2, 
  ArrowLeft,
  User as UserIcon,
  Shield,
  ShieldAlert,
  Mail,
  Calendar
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
  deleteDoc 
} from 'firebase/firestore';
import { User } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAdmin, user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/shop');
      return;
    }

    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        ...doc.data()
      })) as User[];
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, navigate]);

  const handleToggleRole = async (user: User) => {
    if (user.uid === currentUser?.uid) {
      toast.error("Bạn không thể tự thay đổi quyền của chính mình.");
      return;
    }

    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Bạn có chắc chắn muốn thay đổi quyền của ${user.email} thành ${newRole}?`)) return;

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { role: newRole });
      toast.success(`Đã cập nhật quyền cho ${user.email} thành ${newRole}!`);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Lỗi khi cập nhật quyền người dùng.");
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (user.uid === currentUser?.uid) {
      toast.error("Bạn không thể tự xóa tài khoản của chính mình.");
      return;
    }

    if (!window.confirm(`CẢNH BÁO: Bạn có chắc chắn muốn xóa người dùng ${user.email}? Hành động này không thể hoàn tác.`)) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid));
      toast.success("Đã xóa người dùng khỏi hệ thống.");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Lỗi khi xóa người dùng.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-3xl font-serif font-bold text-tea-dark">Quản lý người dùng</h1>
            <p className="text-sm text-gray-500">Xem danh sách và quản lý quyền hạn của các thành viên.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm email hoặc tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-tea-primary transition-colors shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Người dùng</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Email</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Ngày tham gia</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Vai trò</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <AnimatePresence mode="popLayout">
                    {filteredUsers.map((u) => (
                      <motion.tr 
                        key={u.uid}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                              <img 
                                src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName || u.email}&background=1f3d2b&color=fff`} 
                                alt={u.displayName} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-tea-dark">{u.displayName || 'Khách hàng'}</p>
                              {u.uid === currentUser?.uid && (
                                <span className="text-[8px] font-bold uppercase tracking-widest text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">Bạn</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Mail size={14} />
                            <span className="text-sm">{u.email}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Calendar size={14} />
                            <span className="text-sm">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : 'Chưa rõ'}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                            u.role === 'admin' ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                          )}>
                            {u.role === 'admin' ? <ShieldAlert size={12} /> : <UserIcon size={12} />}
                            {u.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => handleToggleRole(u)}
                              disabled={u.uid === currentUser?.uid}
                              title={u.role === 'admin' ? "Hạ quyền xuống Thành viên" : "Nâng quyền lên Quản trị viên"}
                              className={cn(
                                "p-2 rounded-xl transition-all",
                                u.uid === currentUser?.uid ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100 text-gray-400 hover:text-tea-primary"
                              )}
                            >
                              <Shield size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u)}
                              disabled={u.uid === currentUser?.uid}
                              title="Xóa người dùng"
                              className={cn(
                                "p-2 rounded-xl transition-all",
                                u.uid === currentUser?.uid ? "opacity-30 cursor-not-allowed" : "hover:bg-red-50 text-gray-400 hover:text-red-600"
                              )}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && !loading && (
              <div className="py-20 text-center space-y-4">
                <UserIcon className="mx-auto text-gray-200" size={48} />
                <p className="text-sm text-gray-400">Không tìm thấy người dùng nào.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
