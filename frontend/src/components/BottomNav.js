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
    <div className="fixed bottom-0 left-0 right-0 glass-morphism border-t border-slate-200 safe-area-pb z-50">
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'text-[#D4AF37]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
