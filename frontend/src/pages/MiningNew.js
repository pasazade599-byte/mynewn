import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import BottomNav from '@/components/BottomNav';
import { Coins, Zap } from 'lucide-react';
import { toast } from 'sonner';

const Mining = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [miningStatus, setMiningStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tapping, setTapping] = useState(false);
  const [floatingRewards, setFloatingRewards] = useState([]);

  useEffect(() => {
    fetchMiningStatus();
  }, []);

  const fetchMiningStatus = async () => {
    try {
      const res = await axios.get(`${API}/mining/status`);
      setMiningStatus(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const playTapSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleTap = async () => {
    if (tapping) return;
    
    setTapping(true);
    playTapSound();
    
    // Add floating reward animation
    const id = Date.now();
    setFloatingRewards(prev => [...prev, { id, x: Math.random() * 100 - 50 }]);
    setTimeout(() => {
      setFloatingRewards(prev => prev.filter(r => r.id !== id));
    }, 1000);
    
    try {
      const res = await axios.post(`${API}/mining/tap`);
      setMiningStatus({
        ...miningStatus,
        tap_count: res.data.tap_count
      });
      
      const userRes = await axios.get(`${API}/auth/me`);
      updateUser(userRes.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Xəta baş verdi');
    } finally {
      setTapping(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const remaining = 500 - (miningStatus?.tap_count || 0);
  const progress = ((miningStatus?.tap_count || 0) / 500) * 100;

  return (
    <div className="min-h-screen pb-28 bg-slate-950">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-white playfair mb-2">Mayninq</h1>
        <p className="text-slate-500 text-sm">Hər 6 saatda 500 toxunma</p>
      </div>

      <div className="px-6 space-y-6">
        {/* Stats */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-slate-500 text-sm mb-1">Toxunma</p>
              <p className="text-3xl font-bold text-amber-500 playfair" data-testid="tap-count">{miningStatus?.tap_count || 0}</p>
              <p className="text-slate-600 text-xs">/ 500</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-sm mb-1">Qalan</p>
              <p className="text-3xl font-bold text-white playfair" data-testid="remaining-taps">{remaining}</p>
              <p className="text-slate-600 text-xs">toxunma</p>
            </div>
          </div>
          
          <div className="bg-slate-950 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Tap Button */}
        <div className="flex flex-col items-center justify-center py-8 relative">
          {/* Floating rewards */}
          {floatingRewards.map((reward) => (
            <div
              key={reward.id}
              className="absolute text-amber-500 font-bold text-2xl animate-[float_1s_ease-out_forwards] pointer-events-none"
              style={{
                left: `calc(50% + ${reward.x}px)`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              +0.01 USDT
            </div>
          ))}
          
          <button
            data-testid="mining-tap-button"
            onClick={handleTap}
            disabled={tapping || remaining <= 0}
            className={`relative w-56 h-56 rounded-full transition-all ${
              tapping || remaining <= 0
                ? 'opacity-50 cursor-not-allowed'
                : 'active:scale-90 hover:scale-105'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-slate-950 rounded-full flex flex-col items-center justify-center">
              <Coins className="w-20 h-20 text-amber-500 mb-2" strokeWidth={1.5} />
              <p className="text-white text-xl font-bold">TOXUN</p>
              <p className="text-amber-500 text-sm mt-1">+0.01 USDT</p>
            </div>
          </button>

          {remaining <= 0 && (
            <div className="mt-6 text-center">
              <div className="bg-slate-900 border border-yellow-500/30 rounded-2xl p-4">
                <p className="font-semibold text-yellow-500 mb-1">Limit doldu</p>
                <p className="text-sm text-slate-400">6 saat sonra yenidən</p>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-4">
          <div className="flex gap-3">
            <Zap className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-400 mb-2">Necə işləyir?</p>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Gündə 4 dəfə 500 toxunma</li>
                <li>• Hər toxunmada 0.01 USDT</li>
                <li>• Dərhal balansa əlavə olunur</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Total Stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
          <h3 className="font-bold text-white mb-3">Statistika</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl">
              <p className="text-slate-500 text-sm">Bugünkü</p>
              <p className="text-xl font-bold text-white">{miningStatus?.daily_taps || 0}</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl">
              <p className="text-slate-500 text-sm">Qazanc</p>
              <p className="text-xl font-bold text-green-400">{((miningStatus?.daily_taps || 0) * 0.01).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
      
      <style jsx>{`
        @keyframes float {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-100px);
          }
        }
      `}</style>
    </div>
  );
};

export default Mining;
