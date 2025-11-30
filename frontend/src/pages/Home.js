import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import BottomNav from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wallet, TrendingUp, Gem, ArrowUpRight, Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Home = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [vipLevels, setVipLevels] = useState([]);
  const [currentVip, setCurrentVip] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

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
    <div className="min-h-screen pb-24 bg-gradient-to-b from-white via-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-b-[2.5rem] shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-slate-300 text-sm mb-1">Xoş gəldiniz</p>
            <h1 className="text-2xl font-bold">{user.login}</h1>
          </div>
          <button
            data-testid="notifications-button"
            onClick={() => setShowNotifications(true)}
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
        <div className="grid grid-cols-2 gap-5">
          <Card className="bg-white/10 backdrop-blur-md border-white/30 p-5 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-slate-300 text-sm font-medium">Əsas Balans</p>
            </div>
            <p className="text-3xl font-bold playfair gold-gradient-text" data-testid="main-balance">
              {user.balance?.toFixed(2)}
            </p>
            <p className="text-sm text-slate-400 mt-1">USDT</p>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/30 p-5 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-slate-300 text-sm font-medium">Gündəlik</p>
            </div>
            <p className="text-3xl font-bold playfair text-green-400" data-testid="daily-earnings">
              {user.daily_earnings?.toFixed(2)}
            </p>
            <p className="text-sm text-slate-400 mt-1">USDT</p>
          </Card>
        </div>
      </div>

      <div className="px-5 py-8 space-y-8">
        {/* VIP Status */}
        <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 border-2 border-[#D4AF37]/40 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -ml-16 -mb-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F3E5AB] rounded-2xl flex items-center justify-center shadow-lg">
                  <Gem className="w-8 h-8 text-slate-900" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm font-medium mb-1">VIP Səviyyə</p>
                  <p className="text-3xl font-bold playfair gold-gradient-text" data-testid="vip-level">
                    {user.vip_level === 0 ? 'Yoxdur' : `VIP ${user.vip_level}`}
                  </p>
                </div>
              </div>
            </div>

            {currentVip && (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                  <p className="text-slate-400 text-xs mb-1">Gündəlik limit</p>
                  <p className="font-bold text-[#D4AF37] text-lg">{currentVip.max_daily_earnings}</p>
                  <p className="text-slate-400 text-xs">USDT</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                  <p className="text-slate-400 text-xs mb-1">Sifarişlər</p>
                  <p className="font-bold text-[#D4AF37] text-lg">{currentVip.orders_per_day}</p>
                  <p className="text-slate-400 text-xs">ədəd</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                  <p className="text-slate-400 text-xs mb-1">Hər sifariş</p>
                  <p className="font-bold text-[#D4AF37] text-lg">{currentVip.commission_per_order}</p>
                  <p className="text-slate-400 text-xs">USDT</p>
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

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-md max-h-[600px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#D4AF37]" />
              Bildirişlər
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-16 h-16 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-600">Bildiriş yoxdur</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <Card key={notif.id} className="p-4 border-l-4 border-[#D4AF37]">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">{notif.title}</h4>
                    <button
                      onClick={() => setNotifications(notifications.filter(n => n.id !== notif.id))}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{notif.message}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(notif.created_at).toLocaleDateString('az-AZ', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
