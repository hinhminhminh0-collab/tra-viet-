import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ShieldCheck, Truck, Trash } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { toast } from 'sonner';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const shipping = totalPrice > 1000000 || totalPrice === 0 ? 0 : 30000;
  const total = totalPrice + shipping;

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
    toast.success("Đã xóa toàn bộ giỏ hàng.");
  };

  return (
    <div className="min-h-screen bg-tea-light">
      <Header />

      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-tea-dark">Giỏ hàng của bạn</h1>
              <p className="text-gray-500">Bạn đang có <span className="font-bold text-tea-dark">{cart.length}</span> sản phẩm trong giỏ hàng.</p>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setShowClearConfirm(true)}
                className="text-xs font-bold text-red-500 flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <Trash size={14} /> Xóa toàn bộ
              </button>
              <Link to="/shop" className="text-sm font-bold text-tea-dark border-b-2 border-tea-dark pb-1 hover:opacity-70 transition-opacity">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-8">
              <div className="hidden md:grid grid-cols-6 gap-4 pb-4 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <div className="col-span-3">Sản phẩm</div>
                <div className="text-center">Số lượng</div>
                <div className="text-center">Giá</div>
                <div className="text-right">Tổng</div>
              </div>

              <div className="space-y-8">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center pb-8 border-b border-gray-50"
                    >
                      <div className="col-span-3 flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border border-gray-100 shrink-0">
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-serif font-bold text-tea-dark text-lg">{item.name}</h3>
                          <p className="text-xs text-gray-400">Đơn giá: {formatPrice(item.price)}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs font-bold text-red-500 flex items-center gap-1 hover:opacity-70 transition-opacity pt-2"
                          >
                            <Trash2 size={12} /> Xóa
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <div className="flex items-center border border-gray-200 rounded-full p-1 bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-tea-dark"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-tea-dark">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-tea-dark"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="hidden md:block text-center font-medium text-gray-400 text-sm">
                        {formatPrice(item.price)}
                      </div>

                      <div className="text-right font-bold text-tea-dark text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="p-8 rounded-3xl bg-[#f5f2ed] space-y-4">
                  <div className="flex items-center gap-3 text-tea-dark">
                    <Truck size={20} />
                    <h3 className="font-bold">Thông tin giao hàng</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Miễn phí vận chuyển cho đơn hàng từ 1.000.000đ. Thời gian giao hàng dự kiến từ 2-4 ngày làm việc.
                  </p>
                </div>
                <div className="p-8 rounded-3xl bg-[#f5f2ed] space-y-4">
                  <div className="flex items-center gap-3 text-tea-dark">
                    <ShieldCheck size={20} />
                    <h3 className="font-bold">Thanh toán an toàn</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Chúng tôi hỗ trợ nhiều hình thức thanh toán: Chuyển khoản, Ví điện tử, COD. Thông tin của bạn luôn được bảo mật.
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 space-y-8 sticky top-32">
                <h3 className="text-2xl font-serif font-bold text-tea-dark border-b border-gray-100 pb-6">Tổng đơn hàng</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tạm tính</span>
                    <span className="font-bold text-tea-dark">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span className="font-bold text-tea-dark">{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                    <span className="text-lg font-serif font-bold text-tea-dark">Tổng cộng</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-tea-dark">{formatPrice(total)}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">(Đã bao gồm VAT)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <Link 
                    to="/checkout"
                    className="w-full bg-tea-primary text-white py-5 rounded-full font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl shadow-tea-primary/20 flex items-center justify-center gap-3"
                  >
                    Tiến hành thanh toán <ArrowRight size={18} />
                  </Link>
                  <div className="flex items-center justify-center gap-4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 opacity-40 grayscale" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-40 grayscale" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="Paypal" className="h-4 opacity-40 grayscale" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-32 text-center space-y-8">
            <div className="w-32 h-32 bg-[#f5f2ed] rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag size={48} className="text-tea-dark/20" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-serif font-bold text-tea-dark">Giỏ hàng trống</h2>
              <p className="text-gray-500">Có vẻ như bạn chưa chọn được phẩm trà nào ưng ý.</p>
            </div>
            <Link
              to="/shop"
              className="inline-block bg-tea-primary text-white px-12 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl shadow-tea-primary/20"
            >
              Khám phá ngay
            </Link>
          </div>
        )}
      </section>

      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl text-center space-y-6"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                <Trash2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-tea-dark">Xóa giỏ hàng?</h3>
                <p className="text-gray-500">Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng không?</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="py-4 rounded-full font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleClearCart}
                  className="py-4 rounded-full font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
