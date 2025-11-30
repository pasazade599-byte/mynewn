import { useState, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import BottomNav from '@/components/BottomNav';
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
    
    setTimeout(async () => {
      try {
        const res = await axios.post(`${API}/spin/daily`);
        setResult(res.data.reward);
        
        const userRes = await axios.get(`${API}/auth/me`);
        updateUser(userRes.data);
        
        toast.success(`Təbriklər! ${res.data.reward} USDT qazandınız!`);
      } catch (error) {
        toast.error(error.response?.data?.detail || 'Xəta baş verdi');
      } finally {
        setSpinning(false);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen pb-28 bg-slate-950">
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-white playfair mb-2">Gündəlik Çarx</h1>
        <p className="text-slate-500 text-sm">Hər gün bir dəfə çevirin</p>
      </div>

      <div className="px-6 space-y-6">
        <div className="flex flex-col items-center justify-center py-12 relative">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-xl"></div>
          </div>
          
          <div className="relative w-80 h-80">
            <div className={`absolute inset-0 rounded-full shadow-2xl ${spinning ? 'spinning' : ''}`}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-500 border-8 border-slate-900 shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                {[0.5, 20, 1, 10, 2, 5, 1, 2].map((value, index) => {
                  const rotation = (360 / 8) * index;
                  return (
                    <div key={index} className="absolute top-1/2 left-1/2 origin-left" style={{ transform: `rotate(${rotation}deg)`, width: '50%', height: '2px' }}>
                      <div className="absolute left-[60%] -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-amber-500/40">
                        <p className="font-bold text-amber-500 text-sm whitespace-nowrap">{value} USDT</p>
                      </div>
                    </div>
                  );
                })}
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-slate-950 shadow-xl flex items-center justify-center border-4 border-amber-500">
                  <Gift className="w-12 h-12 text-amber-500" />
                </div>
              </div>
            </div>
          </div>

          <Button
            data-testid="spin-button"
            onClick={handleSpin}
            disabled={spinning}
            className="mt-8 px-12 py-6 text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
          >
            {spinning ? (
              <>
                <div className="w-6 h-6 border-3 border-slate-950 border-t-transparent rounded-full animate-spin mr-3" />
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

        {result && (
          <div className="bg-slate-900 border-2 border-green-500/50 rounded-3xl p-6 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <h3 className="text-2xl font-bold text-green-400 mb-2">Təbriklər!</h3>
            <p className="text-5xl font-bold text-amber-500 playfair mb-2" data-testid="spin-result">{result} USDT</p>
            <p className="text-slate-400">Balansınıza əlavə edildi</p>
          </div>
        )}

        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-500" />
            Mükafatlar
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[0.5, 1, 2, 5, 10, 20].map((prize, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl text-center border border-slate-800">
                <p className="text-lg font-bold text-amber-500">{prize}</p>
                <p className="text-xs text-slate-600">USDT</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-4">
          <div className="flex gap-3">
            <Gift className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-400 mb-1">Qayda</p>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Hər gün bir dəfə çevirmək olar</li>
                <li>• Mükafat 0.5 ilə 20 USDT arasındadır</li>
                <li>• Dərhal balansınıza əlavə olunur</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Spin;
