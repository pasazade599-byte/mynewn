import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '@/App';
import BottomNav from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
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
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeInfo = (type) => {
    switch (type) {
      case 'deposit':
        return { icon: ArrowUpRight, label: 'Depozit', color: 'text-green-600', bg: 'bg-green-50' };
      case 'withdraw':
        return { icon: ArrowDownLeft, label: 'Çıxarış', color: 'text-red-600', bg: 'bg-red-50' };
      case 'order':
        return { icon: Package, label: 'Sifariş', color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'mining':
        return { icon: Pickaxe, label: 'Mayninq', color: 'text-purple-600', bg: 'bg-purple-50' };
      case 'spin':
        return { icon: Gift, label: 'Çarx', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      default:
        return { icon: Clock, label: type, color: 'text-slate-600', bg: 'bg-slate-50' };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'pending':
        return 'Gözləmədə';
      case 'rejected':
        return 'İmtina edildi';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('az-AZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-b-3xl shadow-xl mb-6">
        <h1 className="text-2xl font-bold playfair mb-2">Əməliyyat Tarixçəsi</h1>
        <p className="text-slate-300 text-sm">Bütün əməliyyatlarınız</p>
      </div>

      <div className="px-4 space-y-3">
        {transactions.length === 0 ? (
          <Card className="p-8 text-center">
            <HistoryIcon className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-600 font-medium">Əməliyyat tarixçəsi boşdur</p>
          </Card>
        ) : (
          transactions.map((tx) => {
            const typeInfo = getTypeInfo(tx.type);
            const Icon = typeInfo.icon;
            const isDeposit = tx.type === 'deposit';
            const isWithdraw = tx.type === 'withdraw';

            return (
              <Card key={tx.id} data-testid={`transaction-${tx.id}`} className="p-4 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${typeInfo.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${typeInfo.color}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="font-bold text-slate-900">{typeInfo.label}</p>
                        <p className="text-xs text-slate-500">{formatDate(tx.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          tx.type === 'withdraw' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {tx.type === 'withdraw' ? '-' : '+'}{tx.amount.toFixed(2)} USDT
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(tx.status)}`}>
                        {getStatusLabel(tx.status)}
                      </span>
                      
                      {tx.wallet_address && (
                        <p className="text-xs text-slate-500 font-mono truncate max-w-[150px]">
                          {tx.wallet_address}
                        </p>
                      )}
                    </div>

                    {tx.admin_note && (
                      <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-600">
                        <span className="font-semibold">Qeyd:</span> {tx.admin_note}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default History;
