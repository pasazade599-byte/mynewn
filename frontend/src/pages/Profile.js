import { useContext } from 'react';
import { AuthContext } from '@/App';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, LogOut, Wallet, TrendingUp, Calendar, Shield, History as HistoryIcon } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-b-3xl shadow-xl mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#F3E5AB] rounded-full flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-slate-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold playfair">{user.login}</h1>
            <p className="text-slate-300 text-sm">VIP {user.vip_level || 0} Səviyyəsi</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Balance Overview */}
        <Card className="p-6 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-2 border-[#D4AF37]/30">
          <h3 className="font-bold text-lg mb-4">Balans Məlumatları</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-[#D4AF37]" />
                <p className="text-slate-600 text-sm">Əsas Balans</p>
              </div>
              <p className="text-2xl font-bold playfair text-slate-900" data-testid="profile-balance">
                {user.balance?.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">USDT</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <p className="text-slate-600 text-sm">Cəmi Qazanc</p>
              </div>
              <p className="text-2xl font-bold playfair text-green-600" data-testid="profile-total-earnings">
                {user.total_earnings?.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">USDT</p>
            </div>
          </div>
        </Card>

        {/* Account Info */}
        <Card className="p-4">
          <h3 className="font-bold text-lg mb-4">Hesab Məlumatları</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-600" />
                <span className="text-slate-600">Login</span>
              </div>
              <span className="font-semibold text-slate-900">{user.login}</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-600" />
                <span className="text-slate-600">VIP Səviyyə</span>
              </div>
              <span className="font-semibold text-[#D4AF37]">
                {user.vip_level === 0 ? 'Yoxdur' : `VIP ${user.vip_level}`}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-slate-600" />
                <span className="text-slate-600">Depozit</span>
              </div>
              <span className="font-semibold text-slate-900">{user.deposit_amount?.toFixed(2)} USDT</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-600" />
                <span className="text-slate-600">Qeydiyyat tarixi</span>
              </div>
              <span className="font-semibold text-slate-900 text-sm">{formatDate(user.created_at)}</span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-4">
          <h3 className="font-bold text-lg mb-4">Sürətli Əməliyyatlar</h3>
          <div className="space-y-2">
            <Button
              data-testid="view-history-button"
              onClick={() => navigate('/history')}
              className="w-full justify-start bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200"
            >
              <HistoryIcon className="w-5 h-5 mr-3" />
              Əməliyyat Tarixçəsi
            </Button>
            
            <Button
              data-testid="deposit-profile-button"
              onClick={() => navigate('/deposit')}
              className="w-full justify-start bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
            >
              <Wallet className="w-5 h-5 mr-3" />
              Depozit et
            </Button>
            
            <Button
              data-testid="withdraw-profile-button"
              onClick={() => navigate('/withdraw')}
              className="w-full justify-start bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
            >
              <Wallet className="w-5 h-5 mr-3" />
              Çıxarış et
            </Button>
          </div>
        </Card>

        {/* Logout */}
        <Button
          data-testid="logout-button"
          onClick={handleLogout}
          className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Çıxış
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
