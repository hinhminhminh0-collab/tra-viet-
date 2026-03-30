import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, CreditCard, Truck, ShieldCheck, ArrowLeft, Leaf } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';
import { formatPrice, cn } from '../lib/utils';
import { toast } from 'sonner';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'cod'
  });

  const shipping = totalPrice > 1000000 || totalPrice === 0 ? 0 : 30000;
  const total = totalPrice + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống.");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Save order to Firestore
      const orderData = {
        userId: auth.currentUser?.uid || 'anonymous',
        customerInfo: formData,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images[0]
        })),
        totalAmount: total,
        shippingFee: shipping,
        status: 'pending',
        paymentMethod: formData.paymentMethod,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      // Simulate payment processing delay for UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
      toast.success("Thanh toán thành công! Cảm ơn bạn đã mua sắm.");
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.");
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#fcfbf7] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 pt-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white rounded-[40px] p-12 text-center shadow-2xl border border-gray-100 space-y-8 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 text-[#1f3d2b]/5 rotate-12">
              <Leaf size={200} />
            </div>
            
            <div className="relative">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} className="text-green-500" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-[#1f3d2b]">Đặt hàng thành công!</h1>
              <p className="text-gray-500 mt-4 leading-relaxed">
                Cảm ơn bạn đã tin tưởng Trà Việt. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.
              </p>
            </div>

            <div className="relative pt-4">
              <button 
                onClick={() => navigate('/shop')}
                className="w-full bg-[#1f3d2b] text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#1f3d2b]/20"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7]">
      <Header />
      
      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-[#1f3d2b] transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Quay lại giỏ hàng
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-serif font-bold text-[#1f3d2b]">Thanh toán</h1>
              <p className="text-gray-500">Vui lòng điền thông tin giao hàng để hoàn tất đơn hàng.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 space-y-8">
                <div className="flex items-center gap-3 text-[#1f3d2b] border-b border-gray-50 pb-4">
                  <Truck size={20} />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Thông tin nhận hàng</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Họ và tên</label>
                    <input 
                      required
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#1f3d2b] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Số điện thoại</label>
                    <input 
                      required
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0901234567"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#1f3d2b] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
                  <input 
                    required
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@gmail.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#1f3d2b] transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Địa chỉ giao hàng</label>
                  <input 
                    required
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#1f3d2b] transition-colors"
                  />
                </div>
              </div>

              <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 space-y-8">
                <div className="flex items-center gap-3 text-[#1f3d2b] border-b border-gray-50 pb-4">
                  <CreditCard size={20} />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Phương thức thanh toán</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Thanh toán bằng tiền mặt khi nhận hàng' },
                    { id: 'bank', label: 'Chuyển khoản ngân hàng', desc: 'Chuyển khoản qua số tài khoản ngân hàng' },
                    { id: 'momo', label: 'Ví MoMo', desc: 'Thanh toán qua ứng dụng MoMo' },
                    { id: 'card', label: 'Thẻ tín dụng/Ghi nợ', desc: 'Visa, Mastercard, JCB' },
                  ].map((method) => (
                    <label 
                      key={method.id}
                      className={cn(
                        "relative p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col gap-1",
                        formData.paymentMethod === method.id 
                          ? "border-[#1f3d2b] bg-[#1f3d2b]/5" 
                          : "border-gray-100 hover:border-gray-200"
                      )}
                    >
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="text-sm font-bold text-[#1f3d2b]">{method.label}</span>
                      <span className="text-[10px] text-gray-400">{method.desc}</span>
                      {formData.paymentMethod === method.id && (
                        <div className="absolute top-4 right-4 text-[#1f3d2b]">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing || cart.length === 0}
                className="w-full bg-[#1f3d2b] text-white py-6 rounded-full font-bold uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-[#1f3d2b]/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang xử lý thanh toán...
                  </>
                ) : (
                  <>
                    Xác nhận thanh toán {formatPrice(total)}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 space-y-8 sticky top-32">
              <h3 className="text-xl font-serif font-bold text-[#1f3d2b] border-b border-gray-100 pb-6">Tóm tắt đơn hàng</h3>
              
              <div className="max-h-60 overflow-y-auto pr-2 space-y-4 no-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1f3d2b] truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">SL: {item.quantity} x {formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tạm tính</span>
                  <span className="font-bold text-[#1f3d2b]">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phí vận chuyển</span>
                  <span className="font-bold text-[#1f3d2b]">{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="text-lg font-serif font-bold text-[#1f3d2b]">Tổng cộng</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#1f3d2b]">{formatPrice(total)}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50 space-y-3">
                <div className="flex items-center gap-2 text-[#1f3d2b]">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Cam kết bảo mật</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Thông tin thanh toán của bạn được mã hóa và bảo mật tuyệt đối theo tiêu chuẩn quốc tế.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
