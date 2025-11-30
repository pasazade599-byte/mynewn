import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '@/App';
import BottomNav from '@/components/BottomNav';
import { History as HistoryIcon, ArrowUpRight, ArrowDownLeft, Package, Pickaxe, Gift, Clock } from 'lucide-react';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/transactions/history`);
      setTransactions(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeInfo = (type) => {
    switch (type) {
      case 'deposit': return { icon: ArrowUpRight, label: 'Depozit', color: 'text-green-500', bg: 'bg-green-950/30' };
      case 'withdraw': return { icon: ArrowDownLeft, label: 'Çıxarış', color: 'text-red-500', bg: 'bg-red-950/30' };
      case 'order': return { icon: Package, label: 'Sifariş', color: 'text-blue-500', bg: 'bg-blue-950/30' };
      case 'mining': return { icon: Pickaxe, label: 'Mayninq', color: 'text-purple-500', bg: 'bg-purple-950/30' };
      case 'spin': return { icon: Gift, label: 'Çarx', color: 'text-yellow-500', bg: 'bg-yellow-950/30' };
      default: return { icon: Clock, label: type, color: 'text-slate-500', bg: 'bg-slate-900' };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-950/30 border-green-800';
      case 'pending': return 'text-yellow-400 bg-yellow-950/30 border-yellow-800';
      case 'rejected': return 'text-red-400 bg-red-950/30 border-red-800';
      default: return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'pending': return 'Gözləmədə';
      case 'rejected': return 'İmtina edildi';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-slate-950">
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-3xl font-bold text-white playfair mb-2">Əməliyyat Tarixçəsi</h1>
        <p className="text-slate-500 text-sm">Bütün əməliyyatlarınız</p>
      </div>

      <div className="px-6 space-y-3">
        {transactions.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">
            <HistoryIcon className="w-16 h-16 mx-auto mb-4 text-slate-700" />
            <p className="text-slate-400 font-medium">Əməliyyat tarixçəsi boşdur</p>
          </div>
        ) : (
          transactions.map((tx) => {
            const typeInfo = getTypeInfo(tx.type);
            const Icon = typeInfo.icon;

            return (
              <div key={tx.id} data-testid={`transaction-${tx.id}`} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 hover:border-amber-500/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${typeInfo.bg} flex items-center justify-center flex-shrink-0 border border-slate-800`}>
                    <Icon className={`w-6 h-6 ${typeInfo.color}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="font-bold text-white">{typeInfo.label}</p>
                        <p className="text-xs text-slate-500">{formatDate(tx.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${tx.type === 'withdraw' ? 'text-red-400' : 'text-green-400'}`}>
                          {tx.type === 'withdraw' ? '-' : '+'}{tx.amount.toFixed(2)} USDT
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(tx.status)}`}>
                        {getStatusLabel(tx.status)}
                      </span>
                      
                      {tx.wallet_address && (
                        <p className="text-xs text-slate-500 font-mono truncate max-w-[150px]">{tx.wallet_address}</p>
                      )}
                    </div>

                    {tx.admin_note && (
                      <div className="mt-2 p-2 bg-slate-950 rounded text-xs text-slate-400">
                        <span className="font-semibold">Qeyd:</span> {tx.admin_note}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default History;
