import { useState } from 'react';
import { X, Wallet, History, LogOut, Settings, ArrowUpRight, ArrowDownLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/App';
import { Button } from '@/components/ui/button';

const DrawerMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Wallet, label: 'Profil', action: () => { navigate('/profile'); onClose(); } },
    { icon: ArrowUpRight, label: 'Depozit', action: () => { navigate('/deposit'); onClose(); }, color: 'text-green-400' },
    { icon: ArrowDownLeft, label: 'Çıxarış', action: () => { navigate('/withdraw'); onClose(); }, color: 'text-red-400' },
    { icon: History, label: 'Tarixçə', action: () => { navigate('/history'); onClose(); } },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-slate-900 border-l border-amber-500/20 z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative p-6 border-b border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Hesab</p>
                <p className="text-white font-bold text-xl">{user?.login}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-all active:scale-90"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Balance */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-800/50 border border-amber-500/20">
              <p className="text-slate-400 text-xs mb-1">Balans</p>
              <p className="text-3xl font-bold gold-text playfair">{user?.balance?.toFixed(2)}</p>
              <p className="text-slate-500 text-sm">USDT</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30 transition-all active:scale-95 ${
                    item.color || 'text-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800">
            <Button
              onClick={handleLogout}
              className="w-full h-14 bg-red-600/20 hover:bg-red-600/30 border-2 border-red-600/50 text-red-400 font-bold rounded-2xl transition-all active:scale-95"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Çıxış
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DrawerMenu;
