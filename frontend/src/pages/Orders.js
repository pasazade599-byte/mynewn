import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import BottomNav from '@/components/BottomNav';
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
      
      const userRes = await axios.get(`${API}/auth/me`);
      updateUser(userRes.data);
      
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
      setOrders(orders.filter(o => o.id !== orderId));
    } catch (error) {
      toast.error('Xəta baş verdi');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-slate-950">
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-white playfair mb-4">Sifarişlər</h1>
        
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-slate-500 text-sm">Gündəlik qazanc</p>
              <p className="text-2xl font-bold text-amber-500" data-testid="order-daily-earnings">{dailyEarnings.toFixed(2)} USDT</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-sm">Maksimum</p>
              <p className="text-2xl font-bold text-white">{maxEarnings.toFixed(2)} USDT</p>
            </div>
          </div>
          <div className="bg-slate-950 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all" style={{ width: `${maxEarnings > 0 ? (dailyEarnings / maxEarnings) * 100 : 0}%` }}></div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {rejectTimer > 0 && (
          <div className="bg-slate-900 border border-yellow-500/30 rounded-2xl p-4">
            <p className="text-center font-semibold text-yellow-500">Gözləmə müddəti: {rejectTimer} saniyə</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-slate-700" />
            <p className="text-slate-400 font-medium mb-2">Sifariş mövcud deyil</p>
            <Button onClick={fetchOrders} data-testid="refresh-orders-button" className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-2xl">
              Yenilə
            </Button>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} data-testid={`order-${order.id}`} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 hover:border-amber-500/30 transition-all">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-slate-950 border-2 border-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                    {order.qr_code ? (
                      <img src={`data:image/png;base64,${order.qr_code}`} alt="QR" className="w-full h-full object-cover" />
                    ) : (
                      <QrCode className="w-12 h-12 text-slate-600" />
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">{order.product_name}</h3>
                  <p className="text-xs text-slate-500 mb-2">Kod: {order.product_code}</p>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Qiymət:</span>
                      <span className="font-semibold text-white">{order.product_price} USDT</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Cashback:</span>
                      <span className="font-bold text-green-400">{order.cashback} USDT</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">Kateqoriya: {order.category}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button onClick={() => handleAccept(order.id)} disabled={processing || rejectTimer > 0} data-testid={`accept-order-${order.id}`} className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl">
                  <Check className="w-5 h-5 mr-2" />
                  Qəbul et
                </Button>
                <Button onClick={() => handleReject(order.id)} disabled={processing || rejectTimer > 0} data-testid={`reject-order-${order.id}`} className="bg-slate-950 border-2 border-red-600 text-red-500 hover:bg-red-950 font-bold rounded-xl">
                  <X className="w-5 h-5 mr-2" />
                  İmtina
                </Button>
              </div>
            </div>
          ))
        )}

        {orders.length > 0 && (
          <Button onClick={fetchOrders} data-testid="load-more-orders-button" className="w-full bg-slate-900 border-2 border-slate-800 text-white hover:border-amber-500/30 font-semibold rounded-2xl">
            Daha çox yüklə
          </Button>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Orders;
