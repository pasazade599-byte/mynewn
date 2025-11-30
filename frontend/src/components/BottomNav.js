import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, Pickaxe, Gift, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: 'Ana Səhifə' },
    { path: '/orders', icon: Package, label: 'Sifarişlər' },
    { path: '/mining', icon: Pickaxe, label: 'Mayninq' },
    { path: '/spin', icon: Gift, label: 'Çarx' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="relative">
        {/* Blur background */}
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-2xl border-t border-amber-500/10"></div>
        
        {/* Navigation items */}
        <div className="relative flex justify-around items-center py-4 max-w-md mx-auto px-4">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all active:scale-90 ${
                  isActive
                    ? 'text-amber-500'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
                )}
                
                {/* Icon with glow effect */}
                <div className={`relative ${
                  isActive ? 'animate-pulse' : ''
                }`}>
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <div className="absolute inset-0 blur-lg bg-amber-500/30"></div>
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-xs font-medium ${
                  isActive ? 'font-bold' : ''
                }`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
