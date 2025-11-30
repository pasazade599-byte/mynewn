import { useContext } from 'react';
import { AuthContext } from '@/App';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { User, LogOut, Wallet, TrendingUp, Calendar, Shield, History as HistoryIcon } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen pb-28 bg-slate-950">
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-xl">
            <User className="w-10 h-10 text-slate-950" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white playfair">{user.login}</h1>
            <p className="text-slate-500 text-sm">VIP {user.vip_level || 0} Səviyyəsi</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6">
          <h3 className="font-bold text-white text-lg mb-4">Balans Məlumatları</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-amber-500" />
                <p className="text-slate-400 text-sm">Əsas Balans</p>
              </div>
              <p className="text-3xl font-bold text-amber-500 playfair" data-testid="profile-balance">{user.balance?.toFixed(2)}</p>
              <p className="text-xs text-slate-600">USDT</p>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <p className="text-slate-400 text-sm">Cəmi Qazanc</p>
              </div>
              <p className="text-3xl font-bold text-green-400 playfair" data-testid="profile-total-earnings">{user.total_earnings?.toFixed(2)}</p>
              <p className="text-xs text-slate-600">USDT</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
          <h3 className="font-bold text-white text-lg mb-4">Hesab Məlumatları</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-500" />
                <span className="text-slate-400">Login</span>
              </div>
              <span className="font-semibold text-white">{user.login}</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-500" />
                <span className="text-slate-400">VIP Səviyyə</span>
              </div>
              <span className="font-semibold text-amber-500">
                {user.vip_level === 0 ? 'Yoxdur' : `VIP ${user.vip_level}`}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-slate-500" />
                <span className="text-slate-400">Depozit</span>
              </div>
              <span className="font-semibold text-white">{user.deposit_amount?.toFixed(2)} USDT</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-500" />
                <span className="text-slate-400">Qeydiyyat</span>
              </div>
              <span className="font-semibold text-white text-sm">{formatDate(user.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
          <h3 className="font-bold text-white text-lg mb-4">Sürətli Əməliyyatlar</h3>
          <div className="space-y-2">
            <Button onClick={() => navigate('/history')} data-testid="view-history-button" className="w-full justify-start bg-slate-950 hover:bg-slate-800 text-white border border-slate-800 rounded-xl">
              <HistoryIcon className="w-5 h-5 mr-3" />
              Əməliyyat Tarixçəsi
            </Button>
            
            <Button onClick={() => navigate('/deposit')} data-testid="deposit-profile-button" className="w-full justify-start bg-green-950 hover:bg-green-900 text-green-400 border border-green-800 rounded-xl">
              <Wallet className="w-5 h-5 mr-3" />
              Depozit et
            </Button>
            
            <Button onClick={() => navigate('/withdraw')} data-testid="withdraw-profile-button" className="w-full justify-start bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 rounded-xl">
              <Wallet className="w-5 h-5 mr-3" />
              Çıxarış et
            </Button>
          </div>
        </div>

        <Button onClick={handleLogout} data-testid="logout-button" className="w-full h-14 bg-red-600/20 border-2 border-red-600/50 text-red-400 hover:bg-red-600/30 font-bold rounded-2xl">
          <LogOut className="w-5 h-5 mr-2" />
          Çıxış
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
