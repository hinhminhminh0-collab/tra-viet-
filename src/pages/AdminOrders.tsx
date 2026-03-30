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
    <div className="min-h-screen bg-tea-light">
      <Header />
      
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold text-tea-dark">Quản lý đơn hàng</h1>
            <p className="text-sm text-gray-500">Xem và cập nhật trạng thái đơn hàng của khách hàng.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-3 space-y-3">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.div 
                  key={order.id}
                  layoutId={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={cn(
                    "bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md",
                    selectedOrder?.id === order.id ? "border-tea-primary shadow-sm" : "border-gray-100"
                  )}
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gray-50 rounded-lg text-tea-primary">
                        <Package size={16} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Mã đơn</p>
                        <p className="text-xs font-bold text-tea-dark">#{order.id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest", getStatusColor(order.status))}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Khách hàng</p>
                      <p className="text-xs font-bold text-tea-dark truncate">{order.customerInfo.fullName}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Ngày đặt</p>
                      <p className="text-xs font-bold text-tea-dark">
                        {order.createdAt?.toDate().toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sản phẩm</p>
                      <p className="text-xs font-bold text-tea-dark">{order.items.length} món</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tổng tiền</p>
                      <p className="text-xs font-bold text-tea-dark">{formatPrice(order.totalAmount)}</p>
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

          {/* Sidebar: Filters & Detail */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filters Sidebar */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-xs font-bold text-tea-dark uppercase tracking-widest border-b border-gray-50 pb-3 flex items-center gap-2">
                <Filter size={14} /> Bộ lọc & Tìm kiếm
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tìm kiếm</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Tên, SĐT, mã đơn..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-tea-primary w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái</label>
                  <div className="relative">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="appearance-none w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-tea-dark focus:outline-none focus:border-tea-primary cursor-pointer"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="pending">Chờ xử lý</option>
                      <option value="processing">Đang chuẩn bị</option>
                      <option value="shipped">Đang giao</option>
                      <option value="completed">Đã hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-tea-dark pointer-events-none" size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Detail Sidebar */}
            <AnimatePresence mode="wait">
              {selectedOrder ? (
                <motion.div 
                  key={selectedOrder.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                    <h2 className="text-lg font-serif font-bold text-tea-dark">Chi tiết</h2>
                    <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500">
                      <XCircle size={18} />
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-tea-primary">
                        <User size={14} />
                        <h3 className="font-bold uppercase tracking-widest text-[9px]">Khách hàng</h3>
                      </div>
                      <div className="pl-6 space-y-1">
                        <p className="text-xs font-bold text-tea-dark">{selectedOrder.customerInfo.fullName}</p>
                        <p className="text-[10px] text-gray-500">{selectedOrder.customerInfo.phone}</p>
                        <p className="text-[10px] text-gray-500 truncate">{selectedOrder.customerInfo.email}</p>
                        <p className="text-[10px] text-gray-500 leading-relaxed">{selectedOrder.customerInfo.address}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-tea-primary">
                        <Package size={14} />
                        <h3 className="font-bold uppercase tracking-widest text-[9px]">Sản phẩm</h3>
                      </div>
                      <div className="pl-6 space-y-3 max-h-40 overflow-y-auto no-scrollbar">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                            <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold text-tea-dark truncate">{item.name}</p>
                              <p className="text-[9px] text-gray-400">{item.quantity} x {formatPrice(item.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-tea-primary">
                        <CreditCard size={14} />
                        <h3 className="font-bold uppercase tracking-widest text-[9px]">Thanh toán</h3>
                      </div>
                      <div className="pl-6 space-y-3">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-400">Tổng cộng:</span>
                          <span className="font-bold text-tea-dark">{formatPrice(selectedOrder.totalAmount)}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Trạng thái</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {['pending', 'processing', 'shipped', 'completed', 'cancelled'].map(status => (
                              <button
                                key={status}
                                onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                className={cn(
                                  "px-2 py-1.5 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all",
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
                <div className="bg-tea-light p-8 rounded-3xl text-center space-y-3 border border-dashed border-gray-200">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <ExternalLink size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400">Chọn đơn hàng để xem chi tiết</p>
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
