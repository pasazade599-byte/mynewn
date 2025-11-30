import { useState, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowDownLeft, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Withdraw = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < 250) {
      toast.error('Minimum çıxarış 250 USDT');
      return;
    }

    if (withdrawAmount > user.balance) {
      toast.error('Balans kifayət deyil');
      return;
    }

    if (!walletAddress || walletAddress.length < 10) {
      toast.error('Düzgün TRC-20 ünvanı daxil edin');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/transactions/withdraw?amount=${withdrawAmount}&wallet_address=${encodeURIComponent(walletAddress)}`);
      const userRes = await axios.get(`${API}/auth/me`);
      updateUser(userRes.data);
      toast.success('Çıxarış sorğusu yaradıldı');
      setAmount('');
      setWalletAddress('');
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
        <h1 className="text-3xl font-bold text-white playfair mb-2">Çıxarış</h1>
        <p className="text-slate-500 text-sm">USDT (TRC-20) çıxarın</p>
        
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-500" />
              <p className="text-slate-400 text-sm">Mövcud Balans</p>
            </div>
            <p className="text-2xl font-bold text-amber-500" data-testid="available-balance">{user.balance?.toFixed(2)} USDT</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-5">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h3 className="font-bold text-white text-lg mb-4">Çıxarış məlumatları</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-slate-400">TRC-20 Ünvanınız</Label>
              <Input type="text" placeholder="TRC-20 ünvanını daxil edin" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} required data-testid="withdraw-address-input" className="h-12 font-mono text-sm bg-slate-950 border-slate-800 text-white rounded-xl" />
            </div>

            <div>
              <Label className="text-slate-400">Məbləğ (USDT)</Label>
              <Input type="number" step="0.01" min="250" max={user.balance} placeholder="Məbləğ daxil edin" value={amount} onChange={(e) => setAmount(e.target.value)} required data-testid="withdraw-amount-input" className="h-14 text-lg font-semibold bg-slate-950 border-slate-800 text-white rounded-xl" />
              <div className="flex justify-between mt-2">
                <p className="text-sm text-slate-500">Minimum: 250 USDT</p>
                <button type="button" onClick={() => setAmount(user.balance.toString())} data-testid="max-button" className="text-sm font-semibold text-amber-500 hover:underline">MAX</button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[250, 500, 1000].map((preset) => (
                <Button key={preset} type="button" onClick={() => setAmount(preset.toString())} disabled={preset > user.balance} data-testid={`preset-withdraw-${preset}`} className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-white disabled:opacity-30 rounded-xl">
                  {preset.toLocaleString()}
                </Button>
              ))}
            </div>

            <Button type="submit" disabled={loading} data-testid="submit-withdraw-button" className="w-full h-14 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-2xl hover:from-red-500 hover:to-rose-500">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><ArrowDownLeft className="w-5 h-5 mr-2" />Çıxarış sorğusu yarat</>}
            </Button>
          </form>
        </div>

        <div className="bg-yellow-950/30 border border-yellow-700/30 rounded-3xl p-4">
          <h3 className="font-semibold text-yellow-500 mb-2">⚠️ Əməliyyat şərtləri</h3>
          <ul className="text-sm text-yellow-400 space-y-1">
            <li>• Minimum çıxarış: 250 USDT</li>
            <li>• Əməliyyat müddəti: 0-128 saat</li>
            <li>• Təkcə TRC-20 şəbəkəsi</li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Withdraw;
