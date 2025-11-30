import { useState } from 'react';
import axios from 'axios';
import { API } from '@/App';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpRight, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const DEPOSIT_ADDRESS = 'TG1CF2xwduAtw7P8GTbePkkMkPXsVoDBEZ';

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
      toast.success('Depozit sorğusu yaradıldı');
      setAmount('');
      setTimeout(() => navigate('/history'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-28 bg-slate-950">
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-white playfair mb-2">Depozit</h1>
        <p className="text-slate-500 text-sm">USDT (TRC-20) göndərin</p>
      </div>

      <div className="px-6 space-y-5">
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6">
          <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-green-500" />
            Depozit Ünvanı
          </h3>
          
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl mb-4">
            <p className="text-xs text-slate-500 mb-2">TRC-20 Ünvanı:</p>
            <p className="font-mono text-sm text-white break-all mb-3" data-testid="deposit-address">{DEPOSIT_ADDRESS}</p>
            <Button onClick={handleCopy} data-testid="copy-address-button" className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl">
              {copied ? (
                <><CheckCircle className="w-4 h-4 mr-2 text-green-400" />Kopyalandı</>
              ) : (
                <><Copy className="w-4 h-4 mr-2" />Ünvanı kopyala</>
              )}
            </Button>
          </div>

          <div className="bg-yellow-950/30 border border-yellow-700/30 rounded-2xl p-3">
            <p className="text-sm text-yellow-500">
              <span className="font-semibold">⚠️ Diqqət:</span> Təkcə TRC-20 şəbəkəsindən USDT göndərin.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="font-bold text-white text-lg mb-4">Məbləğ daxil edin</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-slate-400">Depozit məbləği (USDT)</Label>
              <Input type="number" step="0.01" min="1000" placeholder="Məbləğ daxil edin" value={amount} onChange={(e) => setAmount(e.target.value)} required data-testid="deposit-amount-input" className="h-14 text-lg font-semibold bg-slate-950 border-slate-800 text-white rounded-xl" />
              <p className="text-sm text-slate-500 mt-2">Minimum: 1,000 USDT</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[1000, 5000, 10000].map((preset) => (
                <Button key={preset} type="button" onClick={() => setAmount(preset.toString())} data-testid={`preset-${preset}`} className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-white rounded-xl">
                  {preset.toLocaleString()}
                </Button>
              ))}
            </div>

            <Button type="submit" disabled={loading} data-testid="submit-deposit-button" className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-500 hover:to-emerald-500">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><ArrowUpRight className="w-5 h-5 mr-2" />Depozit sorğusu yarat</>}
            </Button>
          </form>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Deposit;
