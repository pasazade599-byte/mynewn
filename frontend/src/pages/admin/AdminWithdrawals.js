import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/App';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Check, X, User } from 'lucide-react';
import { toast } from 'sonner';

const AdminWithdrawals = () => {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejecting, setRejecting] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await axios.get(`${API}/admin/withdrawals`);
      setWithdrawals(res.data);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (txId) => {
    try {
      await axios.post(`${API}/admin/withdrawals/${txId}/approve`);
      toast.success('Çıxarış təsdiqləndi');
      fetchWithdrawals();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const handleReject = async () => {
    try {
      await axios.post(`${API}/admin/withdrawals/${rejecting}/reject?note=${encodeURIComponent(rejectNote)}`);
      toast.success('Çıxarış imtina edildi');
      setShowRejectDialog(false);
      setRejecting(null);
      setRejectNote('');
      fetchWithdrawals();
    } catch (error) {
      toast.error('Xəta baş verdi');
    }
  };

  const openRejectDialog = (txId) => {
    setRejecting(txId);
    setShowRejectDialog(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('az-AZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <h1 className="text-2xl font-bold playfair">Çıxarış Sorğuları</h1>
            <p className="text-slate-300 text-sm">Gözləyən: {withdrawals.length}</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {withdrawals.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-slate-600">Gözləyən çıxarış yoxdur</p>
          </Card>
        ) : (
          withdrawals.map((tx) => (
            <Card key={tx.id} data-testid={`withdrawal-${tx.id}`} className="p-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-slate-900">{tx.user_login}</p>
                      <p className="text-xs text-slate-500">{formatDate(tx.created_at)}</p>
                    </div>
                    <p className="text-2xl font-bold text-red-600">-{tx.amount.toFixed(2)} USDT</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <p className="text-xs text-slate-600 mb-1">Ünvan:</p>
                    <p className="text-sm font-mono break-all">{tx.wallet_address}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  data-testid={`approve-withdrawal-${tx.id}`}
                  onClick={() => handleApprove(tx.id)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Təsdiqlə
                </Button>
                <Button
                  data-testid={`reject-withdrawal-${tx.id}`}
                  onClick={() => openRejectDialog(tx.id)}
                  variant="outline"
                  className="border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold"
                >
                  <X className="w-5 h-5 mr-2" />
                  İmtina
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Çıxarışı imtina et</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">İmtina səbəbi (isteğe bağlı)</label>
              <Input
                data-testid="reject-note-input"
                type="text"
                placeholder="Qeyd daxil edin..."
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowRejectDialog(false)}
                variant="outline"
                className="border-2 border-slate-300"
              >
                Ləğv et
              </Button>
              <Button
                data-testid="confirm-reject-button"
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                İmtina et
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWithdrawals;
