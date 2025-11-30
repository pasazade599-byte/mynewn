import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/App';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, User, Gem } from 'lucide-react';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(u => 
        u.login.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/admin/users`);
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
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
        <div className="flex items-center gap-4 mb-4">
          <Button
            data-testid="back-button"
            onClick={() => navigate('/admin')}
            variant="ghost"
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold playfair">İstifadəçilər</h1>
            <p className="text-slate-300 text-sm">Cəmi: {users.length} istifadəçi</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            data-testid="search-users-input"
            type="text"
            placeholder="İstifadəçi axtar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-300"
          />
        </div>
      </div>

      <div className="px-4 space-y-3">
        {filteredUsers.map((user) => (
          <Card key={user.id} data-testid={`user-${user.id}`} className="p-4 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-slate-700" />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-slate-900">{user.login}</p>
                    <p className="text-xs text-slate-500">
                      {user.role === 'admin' ? 'Admin' : 'İstifadəçi'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Gem className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-bold text-[#D4AF37]">
                      VIP {user.vip_level || 0}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded">
                    <p className="text-slate-500 mb-1">Balans</p>
                    <p className="font-bold text-slate-900">{user.balance?.toFixed(2) || 0}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <p className="text-slate-500 mb-1">Qazanc</p>
                    <p className="font-bold text-green-600">{user.total_earnings?.toFixed(2) || 0}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <p className="text-slate-500 mb-1">Depozit</p>
                    <p className="font-bold text-blue-600">{user.deposit_amount?.toFixed(2) || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-slate-600">İstifadəçi tapılmadı</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
