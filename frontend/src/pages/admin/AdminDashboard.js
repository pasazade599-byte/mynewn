import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/App';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Gem, ArrowDownLeft, ArrowUpRight, Bell, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/admin/stats`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold playfair mb-2">Admin Panel</h1>
        <p className="text-slate-300 text-sm">Sistem idarə paneli</p>
      </div>

      <div className="px-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-blue-700 mb-1">Cəmi İstifadəçilər</p>
            <p className="text-3xl font-bold playfair text-blue-900" data-testid="total-users">{stats?.total_users || 0}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <ArrowUpRight className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm text-green-700 mb-1">Gözləyən Depozitlər</p>
            <p className="text-3xl font-bold playfair text-green-900" data-testid="pending-deposits">{stats?.pending_deposits || 0}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <ArrowDownLeft className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-sm text-red-700 mb-1">Gözləyən Çıxarışlar</p>
            <p className="text-3xl font-bold playfair text-red-900" data-testid="pending-withdrawals">{stats?.pending_withdrawals || 0}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-[#D4AF37]/20 to-[#F3E5AB]/20 border-[#D4AF37]/30">
            <div className="flex items-center gap-3 mb-2">
              <Gem className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <p className="text-sm text-slate-700 mb-1">Platform Balansı</p>
            <p className="text-2xl font-bold playfair text-slate-900" data-testid="platform-balance">{stats?.total_platform_balance?.toFixed(2) || 0}</p>
            <p className="text-xs text-slate-600">USDT</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold playfair">Sürətli Əməliyyatlar</h2>
          
          <Button
            data-testid="manage-users-button"
            onClick={() => navigate('/admin/users')}
            className="w-full h-16 justify-start bg-white border-2 border-slate-200 hover:border-blue-400 text-slate-900 font-semibold text-base hover:shadow-lg transition-all"
          >
            <Users className="w-6 h-6 mr-4 text-blue-600" />
            İstifadəçiləri idarə et
          </Button>

          <Button
            data-testid="manage-vip-button"
            onClick={() => navigate('/admin/vip')}
            className="w-full h-16 justify-start bg-white border-2 border-slate-200 hover:border-[#D4AF37] text-slate-900 font-semibold text-base hover:shadow-lg transition-all"
          >
            <Gem className="w-6 h-6 mr-4 text-[#D4AF37]" />
            VIP paketlərini idarə et
          </Button>

          <Button
            data-testid="manage-withdrawals-button"
            onClick={() => navigate('/admin/withdrawals')}
            className="w-full h-16 justify-start bg-white border-2 border-slate-200 hover:border-red-400 text-slate-900 font-semibold text-base hover:shadow-lg transition-all"
          >
            <ArrowDownLeft className="w-6 h-6 mr-4 text-red-600" />
            Çıxarış sorğuları
            {stats?.pending_withdrawals > 0 && (
              <span className="ml-auto bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {stats.pending_withdrawals}
              </span>
            )}
          </Button>

          <Button
            data-testid="send-notifications-button"
            onClick={() => navigate('/admin/notifications')}
            className="w-full h-16 justify-start bg-white border-2 border-slate-200 hover:border-green-400 text-slate-900 font-semibold text-base hover:shadow-lg transition-all"
          >
            <Bell className="w-6 h-6 mr-4 text-green-600" />
            Bildiriş göndər
          </Button>

          <Button
            data-testid="manage-campaigns-button"
            onClick={() => navigate('/admin/campaigns')}
            className="w-full h-16 justify-start bg-white border-2 border-slate-200 hover:border-purple-400 text-slate-900 font-semibold text-base hover:shadow-lg transition-all"
          >
            <Settings className="w-6 h-6 mr-4 text-purple-600" />
            Kampaniyalar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
