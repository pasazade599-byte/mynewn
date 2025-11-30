import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchData();
    requestFullscreen();
  }, []);

  const requestFullscreen = () => {
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
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
      
      // YALNIZ admin bildirişləri
      const adminNotifications = notifRes.data.filter(n => n.is_global && n.title && n.message);
      setNotifications(adminNotifications);
      
      updateUser(userRes.data);
      
      const current = vipRes.data.find(v => v.level === userRes.data.vip_level);
      setCurrentVip(current);
    } catch (error) {
      console.error('Error:', error);
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-slate-950">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-slate-500 text-sm mb-1">Xoş gəldiniz</p>
            <h1 className="text-3xl font-bold text-white">{user.login}</h1>
          </div>
          <div className="flex gap-2">
            {notifications.length > 0 && (
              <button
                data-testid="notifications-button"
                onClick={() => setShowNotifications(true)}
                className="relative p-3 bg-slate-900 border border-amber-500/30 rounded-2xl hover:bg-slate-800 hover:border-amber-500/50 transition-all"
              >
                <Bell className="w-6 h-6 text-amber-500" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold text-white">
                  {notifications.length}
                </span>
              </button>
            )}
            <button
              data-testid="menu-button"
              onClick={() => setDrawerOpen(true)}
              className="p-3 bg-slate-900 border border-amber-500/30 rounded-2xl hover:bg-slate-800 hover:border-amber-500/50 transition-all"
            >
              <Menu className="w-6 h-6 text-amber-500" />
            </button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-slate-400 text-sm">Əsas Balans</p>
            </div>
            <p className="text-4xl font-bold text-amber-500 playfair mb-1" data-testid="main-balance">
              {user.balance?.toFixed(2)}
            </p>
            <p className="text-slate-600 text-sm">USDT</p>
          </div>

          <div className="bg-slate-900 border border-green-500/30 rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-slate-400 text-sm">Gündəlik</p>
            </div>
            <p className="text-4xl font-bold text-green-400 playfair mb-1" data-testid="daily-earnings">
              {user.daily_earnings?.toFixed(2)}
            </p>
            <p className="text-slate-600 text-sm">USDT</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-5">
        {/* VIP Card */}
        <div className="bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-[2px]">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                  <Gem className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1">VIP Səviyyə</p>
                <p className="text-3xl font-bold text-amber-500 playfair" data-testid="vip-level">
                  {user.vip_level === 0 ? '—' : `VIP ${user.vip_level}`}
                </p>
              </div>
            </div>
          </div>

          {currentVip && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                <p className="text-slate-500 text-xs mb-1">Limit</p>
                <p className="font-bold text-amber-500 text-lg">{currentVip.max_daily_earnings}</p>
                <p className="text-slate-600 text-xs">USDT</p>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                <p className="text-slate-500 text-xs mb-1">Sifariş</p>
                <p className="font-bold text-amber-500 text-lg">{currentVip.orders_per_day}</p>
                <p className="text-slate-600 text-xs">ədəd</p>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                <p className="text-slate-500 text-xs mb-1">Hər bir</p>
                <p className="font-bold text-amber-500 text-lg">{currentVip.commission_per_order}</p>
                <p className="text-slate-600 text-xs">USDT</p>
              </div>
            </div>
          )}

          {user.vip_level === 0 ? (
            <Button
              data-testid="deposit-button"
              onClick={() => navigate('/deposit')}
              className="w-full h-14 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-2xl hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Depozit et
            </Button>
          ) : user.vip_level < 5 && (
            <Button
              data-testid="upgrade-vip-button"
              onClick={upgradeVip}
              className="w-full h-14 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-2xl hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              VIP Yüksəlt
            </Button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/deposit')}
            className="h-28 bg-slate-900 border border-green-500/30 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-green-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-green-500" />
            </div>
            <span className="font-bold text-green-400">Depozit</span>
          </button>

          <button
            onClick={() => navigate('/withdraw')}
            className="h-28 bg-slate-900 border border-red-500/30 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-red-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-red-500 rotate-180" />
            </div>
            <span className="font-bold text-red-400">Çıxarış</span>
          </button>
        </div>

        {/* VIP Levels */}
        <div>
          <h2 className="text-xl font-bold text-white playfair mb-4">VIP Səviyyələr</h2>
          <div className="space-y-3">
            {vipLevels.map((vip) => (
              <div
                key={vip.level}
                className={`bg-slate-900 border rounded-3xl p-4 transition-all ${
                  user.vip_level === vip.level
                    ? 'border-amber-500'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl p-[2px] ${
                      user.vip_level === vip.level
                        ? 'bg-gradient-to-br from-amber-500 to-amber-600'
                        : 'bg-slate-800'
                    }`}>
                      <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                        <Gem className={`w-6 h-6 ${
                          user.vip_level === vip.level ? 'text-amber-500' : 'text-slate-600'
                        }`} />
                      </div>
                    </div>
                    <div>
                      <p className={`font-bold text-lg playfair ${
                        user.vip_level === vip.level ? 'text-amber-500' : 'text-slate-300'
                      }`}>{vip.name}</p>
                      <p className="text-xs text-slate-500">{vip.deposit_required.toLocaleString()} USDT</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-amber-500">{vip.max_daily_earnings}</p>
                    <p className="text-xs text-slate-600">USDT/gün</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-md bg-slate-900 border-2 border-amber-500/20">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Bildirişlər
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-16 h-16 mx-auto mb-3 text-slate-700" />
                <p className="text-slate-500">Bildiriş yoxdur</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="bg-slate-950 border border-amber-500/30 p-4 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white">{notif.title}</h4>
                    <button onClick={() => setNotifications(notifications.filter(n => n.id !== notif.id))} className="text-slate-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{notif.message}</p>
                  <p className="text-xs text-slate-600">
                    {new Date(notif.created_at).toLocaleDateString('az-AZ', {
                      day: '2-digit',
                      month: 'long',
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
