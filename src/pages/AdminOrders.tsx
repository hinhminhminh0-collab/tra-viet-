import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Search, 
  Filter, 
  ChevronDown, 
  ExternalLink,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ArrowLeft
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { formatPrice, cn } from '../lib/utils';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  userId: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  paymentMethod: string;
  createdAt: any;
}

export default function AdminOrders() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
      toast.error("Bạn không có quyền truy cập trang này.");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      toast.error("Lỗi khi tải danh sách đơn hàng.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      toast.success(`Đã cập nhật trạng thái đơn hàng thành ${newStatus}`);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Lỗi khi cập nhật trạng thái.");
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang chuẩn bị';
      case 'shipped': return 'Đang giao';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      <Header />
      
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif font-bold text-[#1f3d2b]">Quản lý đơn hàng</h1>
            <p className="text-gray-500">Xem và cập nhật trạng thái đơn hàng của khách hàng.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm tên, SĐT, mã đơn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#1f3d2b] w-full md:w-64"
              />
            </div>
            
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-6 pr-12 py-3 bg-white border border-gray-200 rounded-full text-sm font-bold text-[#1f3d2b] focus:outline-none focus:border-[#1f3d2b] cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang chuẩn bị</option>
                <option value="shipped">Đang giao</option>
                <option value="completed">Đã hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1f3d2b] pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.div 
                  key={order.id}
                  layoutId={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={cn(
                    "bg-white p-6 rounded-3xl border transition-all cursor-pointer hover:shadow-lg",
                    selectedOrder?.id === order.id ? "border-[#1f3d2b] shadow-md" : "border-gray-100"
                  )}
                >
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-xl text-[#1f3d2b]">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mã đơn hàng</p>
                        <p className="text-sm font-bold text-[#1f3d2b]">#{order.id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", getStatusColor(order.status))}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Khách hàng</p>
                      <p className="text-sm font-bold text-[#1f3d2b] truncate">{order.customerInfo.fullName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ngày đặt</p>
                      <p className="text-sm font-bold text-[#1f3d2b]">
                        {order.createdAt?.toDate().toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sản phẩm</p>
                      <p className="text-sm font-bold text-[#1f3d2b]">{order.items.length} món</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tổng tiền</p>
                      <p className="text-sm font-bold text-[#1f3d2b]">{formatPrice(order.totalAmount)}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-400">Không tìm thấy đơn hàng nào.</p>
              </div>
            )}
          </div>

          {/* Order Detail Sidebar */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedOrder ? (
                <motion.div 
                  key={selectedOrder.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 sticky top-32 space-y-8"
                >
                  <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                    <h2 className="text-xl font-serif font-bold text-[#1f3d2b]">Chi tiết đơn hàng</h2>
                    <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500">
                      <XCircle size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[#1f3d2b]">
                        <User size={18} />
                        <h3 className="font-bold uppercase tracking-widest text-[10px]">Thông tin khách hàng</h3>
                      </div>
                      <div className="pl-7 space-y-2">
                        <p className="text-sm font-bold text-[#1f3d2b]">{selectedOrder.customerInfo.fullName}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone size={12} /> {selectedOrder.customerInfo.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail size={12} /> {selectedOrder.customerInfo.email}
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-500">
                          <MapPin size={12} className="mt-0.5 shrink-0" /> {selectedOrder.customerInfo.address}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[#1f3d2b]">
                        <Package size={18} />
                        <h3 className="font-bold uppercase tracking-widest text-[10px]">Sản phẩm đã đặt</h3>
                      </div>
                      <div className="pl-7 space-y-4 max-h-48 overflow-y-auto no-scrollbar">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex gap-3">
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#1f3d2b] truncate">{item.name}</p>
                              <p className="text-[10px] text-gray-400">{item.quantity} x {formatPrice(item.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-3 text-[#1f3d2b]">
                        <CreditCard size={18} />
                        <h3 className="font-bold uppercase tracking-widest text-[10px]">Thanh toán & Trạng thái</h3>
                      </div>
                      <div className="pl-7 space-y-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Phương thức:</span>
                          <span className="font-bold text-[#1f3d2b] uppercase">{selectedOrder.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Tổng cộng:</span>
                          <span className="font-bold text-[#1f3d2b] text-lg">{formatPrice(selectedOrder.totalAmount)}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cập nhật trạng thái</p>
                          <div className="grid grid-cols-2 gap-2">
                            {['pending', 'processing', 'shipped', 'completed', 'cancelled'].map(status => (
                              <button
                                key={status}
                                onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                className={cn(
                                  "px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                                  selectedOrder.status === status 
                                    ? getStatusColor(status)
                                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                )}
                              >
                                {getStatusLabel(status)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-[#f5f2ed] p-12 rounded-[40px] text-center space-y-4 border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <ExternalLink size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-400">Chọn một đơn hàng để xem chi tiết</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
