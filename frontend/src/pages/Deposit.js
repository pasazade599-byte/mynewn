import { useState } from 'react';
import axios from 'axios';
import { API } from '@/App';
import BottomNav from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpRight, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const DEPOSIT_ADDRESS = 'gLxo79237ALFOBQdmoq';

const Deposit = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(DEPOSIT_ADDRESS);
    setCopied(true);
    toast.success('Ünvan kopyalandı');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount < 1000) {
      toast.error('Minimum depozit 1,000 USDT');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/transactions/deposit?amount=${depositAmount}`);
      toast.success('Depozit sorğusu yaradıldı. Admin təsdiq edəndən sonra balansınıza əlavə olunacaq.');
      setAmount('');
      setTimeout(() => navigate('/history'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-b-3xl shadow-xl mb-6">
        <h1 className="text-2xl font-bold playfair mb-2">Depozit</h1>
        <p className="text-slate-300 text-sm">USDT (TRC-20) göndərin</p>
      </div>

      <div className="px-4 space-y-6">
        {/* Deposit Address */}
        <Card className="p-6 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-2 border-[#D4AF37]/30">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-green-600" />
            Depozit Ünvanı
          </h3>
          
          <div className="bg-white p-4 rounded-lg border-2 border-slate-200 mb-4">
            <p className="text-xs text-slate-600 mb-2">TRC-20 Ünvanı:</p>
            <p className="font-mono text-sm text-slate-900 break-all mb-3" data-testid="deposit-address">{DEPOSIT_ADDRESS}</p>
            <Button
              data-testid="copy-address-button"
              onClick={handleCopy}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Ünvanı kopyala
                </>
              )}
            </Button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">⚠️ Diqqət:</span> Təkcə TRC-20 şəbəkəsindən USDT göndərin. Digər şəbəkələrdən göndərilən valyuta itirilə bilər.
            </p>
          </div>
        </Card>

        {/* Amount Form */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Məbləğ daxil edin</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount">Depozit məbləği (USDT)</Label>
              <Input
                id="amount"
                data-testid="deposit-amount-input"
                type="number"
                step="0.01"
                min="1000"
                placeholder="Məbləğ daxil edin"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="h-14 text-lg font-semibold bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
              />
              <p className="text-sm text-slate-500 mt-2">Minimum: 1,000 USDT</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[1000, 5000, 10000].map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  data-testid={`preset-${preset}`}
                  onClick={() => setAmount(preset.toString())}
                  variant="outline"
                  className="border-2 border-slate-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5"
                >
                  {preset.toLocaleString()}
                </Button>
              ))}
            </div>

            <Button
              type="submit"
              data-testid="submit-deposit-button"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:shadow-xl transition-all active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ArrowUpRight className="w-5 h-5 mr-2" />
                  Depozit sorğusu yarat
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Instructions */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Təlimatlar</h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Yuxarıdakı ünvanı kopyalayın</li>
            <li>Kripto pul kisənizdən USDT (TRC-20) göndərin</li>
            <li>Məbləği daxil edərək sorğu yaratın</li>
            <li>Admin təsdiq edəndən sonra balansınıza əlavə olunacaq</li>
          </ol>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Deposit;
