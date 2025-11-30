import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import BottomNav from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Check, X, QrCode } from 'lucide-react';
import { toast } from 'sonner';

const Orders = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [dailyEarnings, setDailyEarnings] = useState(0);
  const [maxEarnings, setMaxEarnings] = useState(0);
  const [rejectTimer, setRejectTimer] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let interval;
    if (rejectTimer > 0) {
      interval = setInterval(() => {
        setRejectTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [rejectTimer]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders/available`);
      setOrders(res.data.orders || []);
      setDailyEarnings(res.data.daily_earnings || 0);
      setMaxEarnings(res.data.max_earnings || 0);
      
      if (res.data.message) {
        toast.info(res.data.message);
      }
    } catch (error) {
      toast.error('Sifarişlər yüklənmədi');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (orderId) => {
    setProcessing(true);
    try {
      const res = await axios.post(`${API}/orders/accept/${orderId}`);
      toast.success(`${res.data.cashback} USDT qazandınız!`);
      
      // Update user balance
      const userRes = await axios.get(`${API}/auth/me`);
      updateUser(userRes.data);
      
      // Refresh orders
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Xəta baş verdi');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (orderId) => {
    setProcessing(true);
    try {
      await axios.post(`${API}/orders/reject/${orderId}`);
      toast.warning('Sifariş imtina edildi. 60 saniyə gözləyin.');
      setRejectTimer(60);
      
      // Remove order from list
      setOrders(orders.filter(o => o.id !== orderId));
    } catch (error) {
      toast.error('Xəta baş verdi');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-b-3xl shadow-xl mb-6">
        <h1 className="text-2xl font-bold playfair mb-4">Sifarişlər</h1>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-300 text-sm">Gündəlik qazanc</p>
              <p className="text-xl font-bold text-[#D4AF37]" data-testid="order-daily-earnings">{dailyEarnings.toFixed(2)} USDT</p>
            </div>
            <div className="text-right">
              <p className="text-slate-300 text-sm">Maksimum</p>
              <p className="text-xl font-bold">{maxEarnings.toFixed(2)} USDT</p>
            </div>
          </div>
          <div className="mt-3 bg-slate-800/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all"
              style={{ width: `${maxEarnings > 0 ? (dailyEarnings / maxEarnings) * 100 : 0}%` }}
            ></div>
          </div>
        </Card>
      </div>

      <div className="px-4 space-y-4">
        {rejectTimer > 0 && (
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <p className="text-center font-semibold text-yellow-800">
              Gözləmə müddəti: {rejectTimer} saniyə
            </p>
          </Card>
        )}

        {orders.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-600 font-medium mb-2">Sifariş mövcud deyil</p>
            <p className="text-sm text-slate-500">Yeni sifarişlər üçün yeniləyin</p>
            <Button
              data-testid="refresh-orders-button"
              onClick={fetchOrders}
              className="mt-4 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-slate-900 font-bold"
            >
              Yenilə
            </Button>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} data-testid={`order-${order.id}`} className="p-4 border-2 border-slate-200 hover:border-[#D4AF37] transition-all">
              <div className="flex gap-4">
                {/* QR Code */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-white border-2 border-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {order.qr_code ? (
                      <img src={`data:image/png;base64,${order.qr_code}`} alt="QR" className="w-full h-full object-cover" />
                    ) : (
                      <QrCode className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Order Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-1">{order.product_name}</h3>
                  <p className="text-xs text-slate-500 mb-2">Kod: {order.product_code}</p>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Qiymət:</span>
                      <span className="font-semibold">{order.product_price} USDT</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Cashback:</span>
                      <span className="font-bold text-green-600">{order.cashback} USDT</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Kateqoriya: {order.category}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button
                  data-testid={`accept-order-${order.id}`}
                  onClick={() => handleAccept(order.id)}
                  disabled={processing || rejectTimer > 0}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold active:scale-95 transition-all"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Qəbul et
                </Button>
                <Button
                  data-testid={`reject-order-${order.id}`}
                  onClick={() => handleReject(order.id)}
                  disabled={processing || rejectTimer > 0}
                  variant="outline"
                  className="border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold active:scale-95 transition-all"
                >
                  <X className="w-5 h-5 mr-2" />
                  İmtina
                </Button>
              </div>
            </Card>
          ))
        )}

        {orders.length > 0 && (
          <Button
            data-testid="load-more-orders-button"
            onClick={fetchOrders}
            className="w-full bg-white border-2 border-slate-200 text-slate-900 hover:border-[#D4AF37] font-semibold"
          >
            Daha çox yüklə
          </Button>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Orders;
