import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/App';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Edit, Gem } from 'lucide-react';
import { toast } from 'sonner';

const AdminVIP = () => {
  const navigate = useNavigate();
  const [vipLevels, setVipLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVip, setEditingVip] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    fetchVipLevels();
  }, []);

  const fetchVipLevels = async () => {
    try {
      const res = await axios.get(`${API}/vip/levels`);
      setVipLevels(res.data);
    } catch (error) {
      console.error('Error fetching VIP levels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vip) => {
    setEditingVip({ ...vip });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API}/admin/vip-levels/${editingVip.level}`, editingVip);
      toast.success('VIP səviyyə yeniləndi');
      setShowDialog(false);
      fetchVipLevels();
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
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-b-3xl shadow-xl mb-6">
        <div className="flex items-center gap-4">
          <Button
            data-testid="back-button"
            onClick={() => navigate('/admin')}
            variant="ghost"
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold playfair">VIP Paketləri</h1>
            <p className="text-slate-300 text-sm">VIP səviyyələrini idarə edin</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {vipLevels.map((vip) => (
          <Card key={vip.level} data-testid={`vip-level-admin-${vip.level}`} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F3E5AB] rounded-full flex items-center justify-center">
                  <Gem className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <p className="font-bold text-lg playfair gold-gradient-text">{vip.name}</p>
                  <p className="text-xs text-slate-500">Səviyyə {vip.level}</p>
                </div>
              </div>
              <Button
                data-testid={`edit-vip-${vip.level}`}
                onClick={() => handleEdit(vip)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Düzəliş et
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Tələb olunan depozit</p>
                <p className="font-bold text-slate-900">{vip.deposit_required.toLocaleString()} USDT</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Maks. gündəlik qazanc</p>
                <p className="font-bold text-green-600">{vip.max_daily_earnings.toLocaleString()} USDT</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Gündəlik sifariş</p>
                <p className="font-bold text-blue-600">{vip.orders_per_day} ədəd</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Sifariş başına</p>
                <p className="font-bold text-[#D4AF37]">{vip.commission_per_order} USDT</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>VIP Səviyyəni Düzəlt</DialogTitle>
          </DialogHeader>
          {editingVip && (
            <div className="space-y-4">
              <div>
                <Label>Tələb olunan depozit (USDT)</Label>
                <Input
                  data-testid="edit-deposit-input"
                  type="number"
                  value={editingVip.deposit_required}
                  onChange={(e) => setEditingVip({ ...editingVip, deposit_required: parseFloat(e.target.value) })}
                  className="h-12"
                />
              </div>

              <div>
                <Label>Maksimum gündəlik qazanc (USDT)</Label>
                <Input
                  data-testid="edit-max-earnings-input"
                  type="number"
                  value={editingVip.max_daily_earnings}
                  onChange={(e) => setEditingVip({ ...editingVip, max_daily_earnings: parseFloat(e.target.value) })}
                  className="h-12"
                />
              </div>

              <div>
                <Label>Gündəlik sifariş sayı</Label>
                <Input
                  data-testid="edit-orders-input"
                  type="number"
                  value={editingVip.orders_per_day}
                  onChange={(e) => setEditingVip({ ...editingVip, orders_per_day: parseInt(e.target.value) })}
                  className="h-12"
                />
              </div>

              <div>
                <Label>Sifariş başına komissiya (USDT)</Label>
                <Input
                  data-testid="edit-commission-input"
                  type="number"
                  step="0.01"
                  value={editingVip.commission_per_order}
                  onChange={(e) => setEditingVip({ ...editingVip, commission_per_order: parseFloat(e.target.value) })}
                  className="h-12"
                />
              </div>

              <Button
                data-testid="save-vip-button"
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-slate-900 font-bold"
              >
                Yadda saxla
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVIP;
