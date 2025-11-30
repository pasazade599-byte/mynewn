import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gem, TrendingUp, Gift, Zap, ArrowRight, Sparkles, Package, Pickaxe, Coins, Target, Shield, Clock, Users } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Gem, title: 'VIP Səviyyələr', desc: '5 səviyyə, 1500 USDT-ə qədər gündəlik qazanc', color: 'from-amber-500 to-amber-600' },
    { icon: Package, title: 'Sifariş Sistemi', desc: 'Hər sifarişdən cashback qazan', color: 'from-blue-500 to-blue-600' },
    { icon: Pickaxe, title: 'Mayninq', desc: 'Toxun və dərhal USDT qazan', color: 'from-purple-500 to-purple-600' },
    { icon: Gift, title: 'Gündəlik Çarx', desc: '20 USDT-ə qədər mükafat', color: 'from-green-500 to-green-600' },
  ];

  const howItWorks = [
    { step: '1', title: 'Qeydiyyatdan keçin', desc: 'Sadəcə login və parol ilə hesab yaradın', icon: Users },
    { step: '2', title: 'Depozit edin', desc: 'Minimum 1,000 USDT depozit edərək VIP alın', icon: Coins },
    { step: '3', title: 'Sifariş qəbul edin', desc: 'Gündəlik limitə qədər sifariş qəbul edin', icon: Package },
    { step: '4', title: 'Qazanın', desc: 'Hər sifarişdən cashback, mayninq və çarxdan bonus', icon: TrendingUp },
  ];

  const stats = [
    { value: '1500', label: 'USDT/Gün', desc: 'Maksimum qazanc' },
    { value: '5', label: 'VIP Səviyyə', desc: 'Premium paketlər' },
    { value: '24/7', label: 'Dəstək', desc: 'Davamlı xidmət' },
    { value: '0-128', label: 'Saat', desc: 'Çıxarış müddəti' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.1),transparent_50%)]" />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="px-6 py-16 max-w-6xl mx-auto text-center">
          <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-[2.5rem] p-1 animate-pulse shadow-2xl">
            <div className="w-full h-full bg-slate-950 rounded-[2.3rem] flex items-center justify-center">
              <Gem className="w-14 h-14 text-amber-500" />
            </div>
          </div>
          
          <h1 className="text-7xl font-bold text-white playfair mb-6 leading-tight">
            Faberlic <span className="text-amber-500">Mining</span>
          </h1>
          
          <p className="text-2xl text-slate-300 mb-4 max-w-3xl mx-auto font-light">
            Premium cashback platforması ilə gündəlik USDT qazanın
          </p>
          
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Sifariş qəbulu, Mayninq, Gündəlik Çarx və Mini Ferma ilə passiv gəlir əldə edin. 
            5 VIP səviyyə, hər biri daha yüksək qazanc imkanları.
          </p>
          
          <div className="flex gap-5 justify-center flex-wrap">
            <Button
              onClick={() => navigate('/register')}
              className="h-16 px-10 text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-2xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl hover:shadow-2xl"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              İndi Başla
            </Button>
            <Button
              onClick={() => navigate('/login')}
              className="h-16 px-10 text-lg font-bold bg-slate-900 border-2 border-amber-500/30 text-white rounded-2xl hover:border-amber-500/50 transition-all"
            >
              Daxil ol
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 py-12 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-900 border border-amber-500/20 rounded-3xl p-6 text-center hover:border-amber-500/40 transition-all">
                <p className="text-5xl font-bold text-amber-500 playfair mb-2">{stat.value}</p>
                <p className="text-xl font-bold text-white mb-1">{stat.label}</p>
                <p className="text-sm text-slate-400">{stat.desc}</p>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div>
            <h2 className="text-4xl font-bold text-white playfair text-center mb-4">Xüsusiyyətlər</h2>
            <p className="text-slate-400 text-center mb-12 text-lg">Platformamızda nələr var?</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="bg-slate-900 border border-amber-500/20 rounded-3xl p-8 hover:border-amber-500/40 transition-all group">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-xl mb-3">{feature.title}</h3>
                    <p className="text-slate-400">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How it Works */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-white playfair text-center mb-4">Necə İşləyir?</h2>
            <p className="text-slate-400 text-center mb-12 text-lg">4 addımda qazanmağa başlayın</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative">
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-xl">
                      {item.step}
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 ml-8">
                      <Icon className="w-7 h-7 text-amber-500" />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* VIP Levels */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-10 mb-20">
            <h2 className="text-4xl font-bold text-white playfair mb-4 text-center">VIP Səviyyələr</h2>
            <p className="text-slate-400 text-center mb-10 text-lg">Hər səviyyə daha çox qazanc imkanı</p>
            
            <div className="grid md:grid-cols-5 gap-5">
              {[
                { level: 1, earnings: 50, deposit: 1000, orders: 10 },
                { level: 2, earnings: 150, deposit: 3000, orders: 30 },
                { level: 3, earnings: 500, deposit: 8000, orders: 100 },
                { level: 4, earnings: 800, deposit: 15000, orders: 160 },
                { level: 5, earnings: 1500, deposit: 30000, orders: 300 },
              ].map((vip) => (
                <div key={vip.level} className="bg-slate-950 border-2 border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 text-center transition-all group">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-[2px]">
                    <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                      <Gem className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <p className="font-bold text-amber-500 text-xl mb-3 playfair">VIP {vip.level}</p>
                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="text-3xl font-bold text-white">{vip.earnings}</p>
                      <p className="text-xs text-slate-500">USDT/gün</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <p className="text-sm text-slate-400">{vip.orders} sifariş</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">Depozit: {vip.deposit.toLocaleString()} USDT</p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <Shield className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="font-bold text-white text-xl mb-3">Təhlükəsiz</h3>
              <p className="text-slate-400">Bütün əməliyyatlar şifrələnmiş və təhlükəsizdir. TRC-20 USDT dəstəyi.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <Clock className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="font-bold text-white text-xl mb-3">Sürətli Çıxarış</h3>
              <p className="text-slate-400">0-128 saat ərzində çıxarış. Minimum 250 USDT.</p>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <Target className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="font-bold text-white text-xl mb-3">Passiv Gəlir</h3>
              <p className="text-slate-400">Mayninq və Mini Ferma ilə avtomatik passiv gəlir.</p>
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-amber-500/30 rounded-3xl p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-amber-500" />
            <h2 className="text-4xl font-bold text-white playfair mb-4">Hazırsınız?</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              İndi qeydiyyatdan keçin və gündəlik USDT qazanmağa başlayın. 
              İlk depozitinizdən dərhal VIP səviyyə əldə edin.
            </p>
            <Button
              onClick={() => navigate('/register')}
              className="h-16 px-12 text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-2xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-2xl"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              İndi Qeydiyyatdan Keç
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-slate-500 text-sm">© 2024 Faberlic Mining. Bütün hüquqlar qorunur.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
