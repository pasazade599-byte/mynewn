import { useState, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import BottomNav from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
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
      const res = await axios.post(
        `${API}/transactions/withdraw?amount=${withdrawAmount}&wallet_address=${encodeURIComponent(walletAddress)}`
      );
      
      // Update user balance
      const userRes = await axios.get(`${API}/auth/me`);
      updateUser(userRes.data);
      
      toast.success('Çıxarış sorğusu yaradıldı. 0-128 saat ərzində emal olunacaq.');
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
    <div className="min-h-screen pb-24 bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-b-3xl shadow-xl mb-6">
        <h1 className="text-2xl font-bold playfair mb-2">Çıxarış</h1>
        <p className="text-slate-300 text-sm">USDT (TRC-20) çıxarın</p>
        
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#D4AF37]" />
              <p className="text-slate-300 text-sm">Mövcud Balans</p>
            </div>
            <p className="text-2xl font-bold text-[#D4AF37]" data-testid="available-balance">
              {user.balance?.toFixed(2)} USDT
            </p>
          </div>
        </Card>
      </div>

      <div className="px-4 space-y-6">
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Çıxarış məlumatları</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="walletAddress">TRC-20 Ünvanınız</Label>
              <Input
                id="walletAddress"
                data-testid="withdraw-address-input"
                type="text"
                placeholder="TRC-20 ünvanını daxil edin"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                required
                className="h-12 font-mono text-sm bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
              />
            </div>

            <div>
              <Label htmlFor="amount">Məbləğ (USDT)</Label>
              <Input
                id="amount"
                data-testid="withdraw-amount-input"
                type="number"
                step="0.01"
                min="250"
                max={user.balance}
                placeholder="Məbləğ daxil edin"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="h-14 text-lg font-semibold bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
              />
              <div className="flex justify-between mt-2">
                <p className="text-sm text-slate-500">Minimum: 250 USDT</p>
                <button
                  type="button"
                  data-testid="max-button"
                  onClick={() => setAmount(user.balance.toString())}
                  className="text-sm font-semibold text-[#D4AF37] hover:underline"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[250, 500, 1000].map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  data-testid={`preset-withdraw-${preset}`}
                  onClick={() => setAmount(preset.toString())}
                  disabled={preset > user.balance}
                  variant="outline"
                  className="border-2 border-slate-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 disabled:opacity-50"
                >
                  {preset.toLocaleString()}
                </Button>
              ))}
            </div>

            <Button
              type="submit"
              data-testid="submit-withdraw-button"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold hover:shadow-xl transition-all active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ArrowDownLeft className="w-5 h-5 mr-2" />
                  Çıxarış sorğusu yarat
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Info */}
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Əməliyyat şərtləri</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Minimum çıxarış məbləği: 250 USDT</li>
            <li>• Əməliyyat müddəti: 0-128 saat</li>
            <li>• Təkcə TRC-20 şəbəkəsi dəstəklənir</li>
            <li>• Admin təsdiq edəndən sonra göndəriləcək</li>
          </ul>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Withdraw;
