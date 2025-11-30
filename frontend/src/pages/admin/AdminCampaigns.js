import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/App';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Gift, Percent, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminCampaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    discount_percent: 0,
    bonus_amount: 0,
    min_deposit: 0,
    is_active: true
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${API}/admin/campaigns`);
      setCampaigns(res.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${API}/admin/campaigns`, newCampaign);
      toast.success('Kampaniya yaradıldı');
      setShowDialog(false);
      setNewCampaign({
        title: '',
        description: '',
        discount_percent: 0,
        bonus_amount: 0,
        min_deposit: 0,
        is_active: true
      });
      fetchCampaigns();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/admin/campaigns/${id}`);
      toast.success('Kampaniya silindi');
      fetchCampaigns();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      await axios.put(`${API}/admin/campaigns/${id}`, { is_active: !isActive });
      toast.success('Status yeniləndi');
      fetchCampaigns();
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
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-b-[2.5rem] shadow-2xl mb-6">
        <div className="flex items-center justify-between">
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
              <h1 className="text-2xl font-bold playfair">Kampaniyalar</h1>
              <p className="text-slate-300 text-sm">Təkliflər və endirimlər</p>
            </div>
          </div>
          <Button
            data-testid="create-campaign-button"
            onClick={() => setShowDialog(true)}
            className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-slate-900 font-bold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Yeni Kampaniya
          </Button>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {campaigns.length === 0 ? (
          <Card className="p-8 text-center">
            <Gift className="w-16 h-16 mx-auto mb-3 text-slate-300" />
            <p className="text-slate-600">Kampaniya yoxdur</p>
          </Card>
        ) : (
          campaigns.map((campaign) => (
            <Card key={campaign.id} data-testid={`campaign-${campaign.id}`} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#F3E5AB] rounded-2xl flex items-center justify-center">
                    {campaign.discount_percent > 0 ? (
                      <Percent className="w-7 h-7 text-slate-900" />
                    ) : (
                      <Gift className="w-7 h-7 text-slate-900" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-900">{campaign.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{campaign.description}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleDelete(campaign.id)}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {campaign.discount_percent > 0 && (
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Endirim</p>
                    <p className="font-bold text-lg text-[#D4AF37]">{campaign.discount_percent}%</p>
                  </div>
                )}
                {campaign.bonus_amount > 0 && (
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Bonus</p>
                    <p className="font-bold text-lg text-green-600">{campaign.bonus_amount} USDT</p>
                  </div>
                )}
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">Min. Depozit</p>
                  <p className="font-bold text-lg text-slate-900">{campaign.min_deposit} USDT</p>
                </div>
              </div>

              <Button
                onClick={() => toggleActive(campaign.id, campaign.is_active)}
                className={`w-full ${
                  campaign.is_active
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-slate-400 hover:bg-slate-500'
                } text-white`}
              >
                {campaign.is_active ? 'Aktiv' : 'Deaktiv'}
              </Button>
            </Card>
          ))
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni Kampaniya</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Başlıq</Label>
              <Input
                value={newCampaign.title}
                onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                placeholder="Kampaniya adı"
              />
            </div>
            <div>
              <Label>Açıqlama</Label>
              <Textarea
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                placeholder="Təsvir"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Endirim (%)</Label>
                <Input
                  type="number"
                  value={newCampaign.discount_percent}
                  onChange={(e) => setNewCampaign({ ...newCampaign, discount_percent: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Bonus (USDT)</Label>
                <Input
                  type="number"
                  value={newCampaign.bonus_amount}
                  onChange={(e) => setNewCampaign({ ...newCampaign, bonus_amount: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Minimum Depozit (USDT)</Label>
              <Input
                type="number"
                value={newCampaign.min_deposit}
                onChange={(e) => setNewCampaign({ ...newCampaign, min_deposit: parseFloat(e.target.value) })}
              />
            </div>
            <Button
              onClick={handleCreate}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-slate-900 font-bold"
            >
              Yarat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCampaigns;
