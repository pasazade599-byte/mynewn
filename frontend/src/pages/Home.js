import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wallet, TrendingUp, Gem, ArrowUpRight, Bell, X, Sparkles, Menu } from 'lucide-react';
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
    requestFullscreen();
  }, []);

  const requestFullscreen = () => {
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Fullscreen request failed:', err);
      });
    }
  };

  const fetchData = async () => {
    try {
      const [vipRes, notifRes, userRes] = await Promise.all([
        axios.get(`${API}/vip/levels`),
        axios.get(`${API}/notifications`),
        axios.get(`${API}/auth/me`)
      ]);
      
      setVipLevels(vipRes.data);
      
      // Filter only admin notifications
      const adminNotifications = notifRes.data.filter(n => n.is_global);
      setNotifications(adminNotifications);
      
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
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 relative">
      {/* Premium Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10"></div>
        <div className="relative px-6 pt-8 pb-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-slate-400 text-sm mb-1">Xoş gəldiniz</p>
              <h1 className="text-3xl font-bold text-white">{user.login}</h1>
            </div>
            <button
              data-testid="notifications-button"
              onClick={() => setShowNotifications(true)}
              className="relative p-3 bg-slate-800/50 backdrop-blur-sm border border-amber-500/20 rounded-2xl hover:bg-slate-800 hover:border-amber-500/40 transition-all active:scale-95"
            >
              <Bell className="w-6 h-6 text-amber-500" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-rose-500 rounded-full text-xs flex items-center justify-center font-bold text-white border-2 border-slate-950">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="premium-card rounded-3xl p-5 glow-pulse">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Əsas Balans</p>
              </div>
              <p className="text-4xl font-bold gold-text playfair mb-1" data-testid="main-balance">
                {user.balance?.toFixed(2)}
              </p>
              <p className="text-slate-500 text-sm">USDT</p>
            </div>

            <div className="premium-card rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Gündəlik</p>
              </div>
              <p className="text-4xl font-bold text-green-400 playfair mb-1" data-testid="daily-earnings">
                {user.daily_earnings?.toFixed(2)}
              </p>
              <p className="text-slate-500 text-sm">USDT</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* VIP Status Card */}
        <div className="premium-card rounded-3xl p-6 relative overflow-hidden border-2 border-amber-500/20">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-1 glow-pulse">
                  <div className="w-full h-full rounded-[1.3rem] bg-slate-950 flex items-center justify-center">
                    <Gem className="w-10 h-10 text-amber-500" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">VIP Səviyyə</p>
                  <p className="text-4xl font-bold gold-text playfair" data-testid="vip-level">
                    {user.vip_level === 0 ? 'Yoxdur' : `VIP ${user.vip_level}`}
                  </p>
                </div>
              </div>
            </div>

            {currentVip && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-800">
                  <p className="text-slate-400 text-xs mb-1">Gündəlik limit</p>
                  <p className="font-bold text-amber-500 text-xl">{currentVip.max_daily_earnings}</p>
                  <p className="text-slate-500 text-xs mt-1">USDT</p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-800">
                  <p className="text-slate-400 text-xs mb-1">Sifarişlər</p>
                  <p className="font-bold text-amber-500 text-xl">{currentVip.orders_per_day}</p>
                  <p className="text-slate-500 text-xs mt-1">ədəd</p>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-800">
                  <p className="text-slate-400 text-xs mb-1">Hər sifariş</p>
                  <p className="font-bold text-amber-500 text-xl">{currentVip.commission_per_order}</p>
                  <p className="text-slate-500 text-xs mt-1">USDT</p>
                </div>
              </div>
            )}

            {user.vip_level === 0 && (
              <Button
                data-testid="deposit-button"
                onClick={() => navigate('/deposit')}
                className="w-full h-16 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white font-bold text-lg rounded-2xl hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-all active:scale-95"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Depozit et
              </Button>
            )}

            {user.vip_level > 0 && user.vip_level < 5 && (
              <Button
                data-testid="upgrade-vip-button"
                onClick={upgradeVip}
                className="w-full h-16 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white font-bold text-lg rounded-2xl hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-all active:scale-95"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                VIP Yüksəlt
              </Button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            data-testid="deposit-quick-button"
            onClick={() => navigate('/deposit')}
            className="h-32 premium-card rounded-3xl p-6 hover:border-green-500/40 transition-all active:scale-95 flex flex-col items-center justify-center gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-white text-lg">Depozit</span>
          </button>

          <button
            data-testid="withdraw-quick-button"
            onClick={() => navigate('/withdraw')}
            className="h-32 premium-card rounded-3xl p-6 hover:border-red-500/40 transition-all active:scale-95 flex flex-col items-center justify-center gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-7 h-7 text-white rotate-180" />
            </div>
            <span className="font-bold text-white text-lg">Çıxarış</span>
          </button>
        </div>

        {/* VIP Levels */}
        <div>
          <h2 className="text-2xl font-bold text-white playfair mb-5">VIP Səviyyələr</h2>
          <div className="space-y-3">
            {vipLevels.map((vip) => (
              <div
                key={vip.level}
                data-testid={`vip-level-${vip.level}`}
                className={`premium-card rounded-3xl p-5 transition-all ${
                  user.vip_level === vip.level
                    ? 'border-2 border-amber-500 glow-pulse'
                    : 'hover:border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl p-1 ${
                      user.vip_level === vip.level
                        ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                        : 'bg-slate-800'
                    }`}>
                      <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center">
                        <Gem className={`w-8 h-8 ${
                          user.vip_level === vip.level ? 'text-amber-500' : 'text-slate-600'
                        }`} />
                      </div>
                    </div>
                    <div>
                      <p className={`font-bold text-xl playfair mb-1 ${
                        user.vip_level === vip.level ? 'gold-text' : 'text-white'
                      }`}>{vip.name}</p>
                      <p className="text-sm text-slate-400">Depozit: {vip.deposit_required.toLocaleString()} USDT</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Limit</p>
                    <p className="font-bold text-2xl text-amber-500">{vip.max_daily_earnings}</p>
                    <p className="text-xs text-slate-500">USDT</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-md max-h-[600px] overflow-y-auto bg-slate-900 border-2 border-amber-500/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Bell className="w-5 h-5 text-amber-500" />
              Bildirişlər
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-16 h-16 mx-auto mb-3 text-slate-700" />
                <p className="text-slate-400">Bildiriş yoxdur</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="premium-card p-4 border-l-4 border-amber-500 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white">{notif.title}</h4>
                    <button
                      onClick={() => setNotifications(notifications.filter(n => n.id !== notif.id))}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{notif.message}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(notif.created_at).toLocaleDateString('az-AZ', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
