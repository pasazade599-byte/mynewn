import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import BottomNav from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Pickaxe, Coins } from 'lucide-react';
import { toast } from 'sonner';

const Mining = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [miningStatus, setMiningStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tapping, setTapping] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    fetchMiningStatus();
  }, []);

  const fetchMiningStatus = async () => {
    try {
      const res = await axios.get(`${API}/mining/status`);
      setMiningStatus(res.data);
    } catch (error) {
      console.error('Error fetching mining status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTap = async () => {
    if (tapping) return;
    
    setTapping(true);
    setAnimate(true);
    
    try {
      const res = await axios.post(`${API}/mining/tap`);
      setMiningStatus({
        ...miningStatus,
        tap_count: res.data.tap_count
      });
      
      // Update user balance
      const userRes = await axios.get(`${API}/auth/me`);
      updateUser(userRes.data);
      
      toast.success(`+${res.data.reward} USDT`, {
        description: `Qalan: ${res.data.remaining} toxunma`
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Xəta baş verdi');
    } finally {
      setTapping(false);
      setTimeout(() => setAnimate(false), 300);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const remaining = 500 - (miningStatus?.tap_count || 0);
  const progress = ((miningStatus?.tap_count || 0) / 500) * 100;

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-b-3xl shadow-xl mb-6">
        <h1 className="text-2xl font-bold playfair mb-2">Mayninq</h1>
        <p className="text-slate-300 text-sm">Hər 6 saatda 500 toxunma</p>
      </div>

      <div className="px-4 space-y-6">
        {/* Mining Stats */}
        <Card className="p-6 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-2 border-[#D4AF37]/30">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-slate-600 text-sm mb-1">Toxunma sayı</p>
              <p className="text-2xl font-bold playfair text-[#D4AF37]" data-testid="tap-count">{miningStatus?.tap_count || 0} / 500</p>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-1">Qalan</p>
              <p className="text-2xl font-bold playfair text-slate-900" data-testid="remaining-taps">{remaining}</p>
            </div>
          </div>
          
          <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </Card>

        {/* Tap Button */}
        <div className="flex flex-col items-center justify-center py-8">
          <button
            data-testid="mining-tap-button"
            onClick={handleTap}
            disabled={tapping || remaining <= 0}
            className={`w-64 h-64 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F3E5AB] shadow-2xl flex flex-col items-center justify-center transition-all ${
              animate ? 'tap-animation' : ''
            } ${
              tapping || remaining <= 0
                ? 'opacity-50 cursor-not-allowed'
                : 'active:scale-95 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]'
            }`}
          >
            <Coins className="w-24 h-24 text-white mb-4" strokeWidth={1.5} />
            <p className="text-white text-2xl font-bold playfair">TOXUN</p>
            <p className="text-white/80 text-sm mt-2">+0.01 USDT</p>
          </button>

          {remaining <= 0 && (
            <Card className="mt-6 p-4 bg-yellow-50 border-yellow-200 text-center">
              <p className="font-semibold text-yellow-800 mb-1">Gündəlik limit dolub</p>
              <p className="text-sm text-yellow-700">6 saat sonra yenidən cəhd edin</p>
            </Card>
          )}
        </div>

        {/* Info */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <Pickaxe className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Necə işləyir?</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Hər 6 saatda 500 toxunma haqqınız var</li>
                <li>• Hər toxunmaşda 0.01 USDT qazanırsınız</li>
                <li>• Qazandığınız dərhal balansınıza əlavə olunur</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Total Mining Stats */}
        <Card className="p-4">
          <h3 className="font-bold text-lg mb-3">Cəmi statistika</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-slate-600 text-sm">Bugünkü toxunma</p>
              <p className="text-xl font-bold text-slate-900">{miningStatus?.daily_taps || 0}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-slate-600 text-sm">Bugünkü qazanc</p>
              <p className="text-xl font-bold text-green-600">{((miningStatus?.daily_taps || 0) * 0.01).toFixed(2)} USDT</p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Mining;
