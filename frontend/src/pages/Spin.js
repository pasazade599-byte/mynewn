import { useState, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import BottomNav from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Spin = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const handleSpin = async () => {
    setSpinning(true);
    setResult(null);
    
    // Simulate spinning animation
    setTimeout(async () => {
      try {
        const res = await axios.post(`${API}/spin/daily`);
        setResult(res.data.reward);
        
        // Update user balance
        const userRes = await axios.get(`${API}/auth/me`);
        updateUser(userRes.data);
        
        toast.success(`Təbriklər! ${res.data.reward} USDT qazandınız!`);
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Xəta baş verdi');
      } finally {
        setSpinning(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-b-3xl shadow-xl mb-6">
        <h1 className="text-2xl font-bold playfair mb-2">Gündəlik Çarx</h1>
        <p className="text-slate-300 text-sm">Hər gün bir dəfə çarx çevirmək haqqınız var</p>
      </div>

      <div className="px-4 space-y-6">
        {/* Spin Wheel */}
        <div className="flex flex-col items-center justify-center py-12 relative">
          {/* Wheel pointer */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-600 drop-shadow-xl"></div>
          </div>
          
          <div className="relative w-80 h-80">
            {/* Wheel - only this rotates */}
            <div className={`absolute inset-0 rounded-full shadow-2xl ${spinning ? 'spinning' : ''}`}>
              {/* Wheel background with segments */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] border-8 border-white shadow-[0_0_40px_rgba(212,175,55,0.4)]">
                {/* 8 segments */}
                {[0.5, 20, 1, 10, 2, 5, 1, 2].map((value, index) => {
                  const rotation = (360 / 8) * index;
                  return (
                    <div
                      key={index}
                      className="absolute top-1/2 left-1/2 origin-left"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        width: '50%',
                        height: '2px'
                      }}
                    >
                      <div className="absolute left-[60%] -translate-y-1/2 bg-white/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/40">
                        <p className="font-bold text-white text-sm whitespace-nowrap">{value} USDT</p>
                      </div>
                    </div>
                  );
                })}
                
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-[#D4AF37]">
                  <Gift className="w-12 h-12 text-[#D4AF37]" />
                </div>
              </div>
            </div>
          </div>

          <Button
            data-testid="spin-button"
            onClick={handleSpin}
            disabled={spinning}
            className="mt-8 px-12 py-6 text-xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-slate-900 hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50"
          >
            {spinning ? (
              <>
                <div className="w-6 h-6 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mr-3" />
                Çevrilir...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-3" />
                ÇARX ÇEVİR
              </>
            )}
          </Button>
        </div>

        {/* Result */}
        {result && (
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-green-600" />
            <h3 className="text-2xl font-bold playfair text-green-900 mb-2">Təbriklər!</h3>
            <p className="text-4xl font-bold playfair gold-gradient-text mb-2" data-testid="spin-result">{result} USDT</p>
            <p className="text-green-700">Balansınıza əlavə edildi</p>
          </Card>
        )}

        {/* Prizes */}
        <Card className="p-4">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#D4AF37]" />
            Mükafatlar
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[0.5, 1, 2, 5, 10, 20].map((prize, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-lg text-center border border-slate-200">
                <p className="text-lg font-bold text-[#D4AF37]">{prize}</p>
                <p className="text-xs text-slate-600">USDT</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Info */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <Gift className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Qayda</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Hər gün bir dəfə çarx çevirmək olar</li>
                <li>• Mükafat 0.5 ilə 20 USDT arasındadır</li>
                <li>• Qazandığınız dərhal balansınıza əlavə olunur</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Spin;
