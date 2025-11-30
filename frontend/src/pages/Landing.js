import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gem, TrendingUp, Gift, Zap, ArrowRight, Sparkles } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Gem, title: 'VIP Səviyyələr', desc: '5 səviyyə, 1500 USDT-ə qədər gündəlik qazanc' },
    { icon: TrendingUp, title: 'Sifariş Sistemi', desc: 'Hər sifarişdən cashback qazan' },
    { icon: Zap, title: 'Mayninq', desc: 'Toxun və dərhal USDT qazan' },
    { icon: Gift, title: 'Gündəlik Çarx', desc: '20 USDT-ə qədər mükafat' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.08),transparent_50%)]" />
      
      <div className="relative z-10 px-6 py-12 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-[2rem] p-1 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[1.8rem] flex items-center justify-center">
              <Gem className="w-12 h-12 text-amber-500" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-white playfair mb-4">
            Faberlic <span className="text-amber-500">Mining</span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Premium cashback sistemi ilə gündəlik USDT qazan. Sifarişlər, Mayninq, Çarx və daha çoxu.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate('/register')}
              className="h-16 px-8 text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-2xl hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Qeydiyyat
            </Button>
            <Button
              onClick={() => navigate('/login')}
              className="h-16 px-8 text-lg font-bold bg-slate-900 border-2 border-amber-500/30 text-white rounded-2xl hover:border-amber-500/50 transition-all"
            >
              Daxil ol
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-slate-900 border border-amber-500/20 rounded-3xl p-6 hover:border-amber-500/40 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* VIP Levels */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-white playfair mb-6 text-center">VIP Səviyyələr</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((level) => {
              const earnings = [50, 150, 500, 800, 1500][level - 1];
              const deposits = [1000, 3000, 8000, 15000, 30000][level - 1];
              return (
                <div key={level} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center hover:border-amber-500/50 transition-all">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-[2px]">
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                      <Gem className="w-6 h-6 text-amber-500" />
                    </div>
                  </div>
                  <p className="font-bold text-amber-500 text-lg mb-1">VIP {level}</p>
                  <p className="text-2xl font-bold text-white mb-1">{earnings}</p>
                  <p className="text-xs text-slate-500">USDT/gün</p>
                  <p className="text-xs text-slate-600 mt-2">{deposits.toLocaleString()} USDT</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-400 mb-4">Hazır qazanmağa?</p>
          <Button
            onClick={() => navigate('/register')}
            className="h-14 px-12 text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-2xl hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            İndi Başla
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
