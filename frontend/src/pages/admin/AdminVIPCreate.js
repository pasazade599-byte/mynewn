import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/App';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Gem } from 'lucide-react';
import { toast } from 'sonner';

const AdminVIPCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vipData, setVipData] = useState({
    level: 6,
    name: 'VIP 6',
    deposit_required: 50000,
    max_daily_earnings: 2500,
    orders_per_day: 500,
    commission_per_order: 5,
    is_active: true
  });

  const handleCreate = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/admin/vip-levels`, vipData);
      toast.success('Yeni VIP səviyyə yaradıldı');
      navigate('/admin/vip');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-white to-slate-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-b-[2.5rem] shadow-2xl mb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/admin/vip')}
            variant="ghost"
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold playfair">Yeni VIP Səviyyə</h1>
            <p className="text-slate-300 text-sm">VIP paket yaratma</p>
          </div>
        </div>
      </div>

      <div className="px-5">
        <Card className="p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#F3E5AB] rounded-3xl flex items-center justify-center shadow-xl">
              <Gem className="w-10 h-10 text-slate-900" />
            </div>
            <div>
              <h2 className="text-2xl font-bold playfair">Yeni VIP Paket</h2>
              <p className="text-slate-600">Parametrləri təyin edin</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Səviyyə nömrəsi</Label>
                <Input
                  type="number"
                  value={vipData.level}
                  onChange={(e) => setVipData({ ...vipData, level: parseInt(e.target.value), name: `VIP ${e.target.value}` })}
                  className="h-14 text-lg"
                />
              </div>
              <div>
                <Label>Ad</Label>
                <Input
                  value={vipData.name}
                  onChange={(e) => setVipData({ ...vipData, name: e.target.value })}
                  className="h-14 text-lg"
                />
              </div>
            </div>

            <div>
              <Label>Tələb olunan depozit (USDT)</Label>
              <Input
                type="number"
                value={vipData.deposit_required}
                onChange={(e) => setVipData({ ...vipData, deposit_required: parseFloat(e.target.value) })}
                className="h-14 text-lg"
              />
            </div>

            <div>
              <Label>Maksimum gündəlik qazanc (USDT)</Label>
              <Input
                type="number"
                value={vipData.max_daily_earnings}
                onChange={(e) => setVipData({ ...vipData, max_daily_earnings: parseFloat(e.target.value) })}
                className="h-14 text-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Gündəlik sifariş sayı</Label>
                <Input
                  type="number"
                  value={vipData.orders_per_day}
                  onChange={(e) => setVipData({ ...vipData, orders_per_day: parseInt(e.target.value) })}
                  className="h-14 text-lg"
                />
              </div>
              <div>
                <Label>Sifariş başına komissiya</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={vipData.commission_per_order}
                  onChange={(e) => setVipData({ ...vipData, commission_per_order: parseFloat(e.target.value) })}
                  className="h-14 text-lg"
                />
              </div>
            </div>

            <div className="pt-6">
              <Button
                onClick={handleCreate}
                disabled={loading}
                className="w-full h-16 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-slate-900 font-bold text-lg"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-6 h-6 mr-2" />
                    VIP Səviyyə Yarat
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminVIPCreate;
