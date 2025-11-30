import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import BottomNav from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, Gem, ArrowUpRight, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Home = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [vipLevels, setVipLevels] = useState([]);
  const [currentVip, setCurrentVip] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vipRes, notifRes, userRes] = await Promise.all([
        axios.get(`${API}/vip/levels`),
        axios.get(`${API}/notifications`),
        axios.get(`${API}/auth/me`)
      ]);
      
      setVipLevels(vipRes.data);
      setNotifications(notifRes.data);
      updateUser(userRes.data);
      
      const current = vipRes.data.find(v => v.level === userRes.data.vip_level);
      setCurrentVip(current);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const upgradeVip = async () => {
    try {
      const res = await axios.post(`${API}/vip/upgrade`);
      if (res.data.success) {
        toast.success(`VIP ${res.data.new_level} səviyyəsinə yüksəldiniz!`);
        fetchData();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('Xəta baş verdi');
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
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-b-3xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-slate-300 text-sm mb-1">Xoş gəldiniz</p>
            <h1 className="text-2xl font-bold">{user.login}</h1>
          </div>
          <button
            data-testid="notifications-button"
            onClick={() => setNotifications([])}
            className="relative p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all active:scale-95"
          >
            <Bell className="w-6 h-6" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                {notifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-[#D4AF37]" />
              <p className="text-slate-300 text-sm">Əsas Balans</p>
            </div>
            <p className="text-2xl font-bold playfair gold-gradient-text" data-testid="main-balance">
              {user.balance?.toFixed(2)} <span className="text-base">USDT</span>
            </p>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <p className="text-slate-300 text-sm">Gündəlik Qazanc</p>
            </div>
            <p className="text-2xl font-bold playfair text-green-400" data-testid="daily-earnings">
              {user.daily_earnings?.toFixed(2)} <span className="text-base">USDT</span>
            </p>
          </Card>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* VIP Status */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 border-[#D4AF37]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F3E5AB] rounded-full flex items-center justify-center">
                  <Gem className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">VIP Səviyyə</p>
                  <p className="text-2xl font-bold playfair gold-gradient-text" data-testid="vip-level">
                    {user.vip_level === 0 ? 'Yoxdur' : `VIP ${user.vip_level}`}
                  </p>
                </div>
              </div>
            </div>

            {currentVip && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Gündəlik limit:</span>
                  <span className="font-semibold text-[#D4AF37]">{currentVip.max_daily_earnings} USDT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Sifariş sayı:</span>
                  <span className="font-semibold text-[#D4AF37]">{currentVip.orders_per_day} ədəd</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Sifariş başına:</span>
                  <span className="font-semibold text-[#D4AF37]">{currentVip.commission_per_order} USDT</span>
                </div>
              </div>
            )}

            {user.vip_level === 0 && (
              <div className="mt-4">
                <p className="text-slate-300 text-sm mb-3">VIP səviyyə əldə etmək üçün depozit edin</p>
                <Button
                  data-testid="deposit-button"
                  onClick={() => navigate('/deposit')}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-slate-900 font-bold hover:shadow-xl transition-all active:scale-95"
                >
                  Depozit et
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {user.vip_level > 0 && user.vip_level < 5 && (
              <div className="mt-4">
                <Button
                  data-testid="upgrade-vip-button"
                  onClick={upgradeVip}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-slate-900 font-bold hover:shadow-xl transition-all active:scale-95"
                >
                  VIP Yüksəlt
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            data-testid="deposit-quick-button"
            onClick={() => navigate('/deposit')}
            className="h-20 bg-white border-2 border-slate-200 hover:border-[#D4AF37] text-slate-900 font-semibold hover:shadow-lg transition-all active:scale-95"
          >
            <div className="flex flex-col items-center gap-1">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
              <span>Depozit</span>
            </div>
          </Button>

          <Button
            data-testid="withdraw-quick-button"
            onClick={() => navigate('/withdraw')}
            className="h-20 bg-white border-2 border-slate-200 hover:border-[#D4AF37] text-slate-900 font-semibold hover:shadow-lg transition-all active:scale-95"
          >
            <div className="flex flex-col items-center gap-1">
              <ArrowUpRight className="w-6 h-6 text-red-600 rotate-180" />
              <span>Çıxarış</span>
            </div>
          </Button>
        </div>

        {/* All VIP Levels */}
        <div>
          <h2 className="text-xl font-bold playfair mb-4">VIP Səviyyələr</h2>
          <div className="space-y-3">
            {vipLevels.map((vip) => (
              <Card
                key={vip.level}
                data-testid={`vip-level-${vip.level}`}
                className={`p-4 border-2 transition-all ${
                  user.vip_level === vip.level
                    ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg playfair gold-gradient-text">{vip.name}</p>
                    <p className="text-sm text-slate-600">Depozit: {vip.deposit_required} USDT</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Gündəlik limit</p>
                    <p className="font-bold text-lg text-[#D4AF37]">{vip.max_daily_earnings} USDT</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
