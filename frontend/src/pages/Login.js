import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { API, AuthContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { LogIn, Gem } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/login`, formData);
      login(res.data.token, res.data.user);
      toast.success('Xoş gəldiniz!');
      
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Giriş uğursuz oldu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Card className="w-full max-w-md p-8 bg-white shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#D4AF37] to-[#F3E5AB] rounded-full flex items-center justify-center shadow-lg">
            <Gem className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold playfair gold-gradient-text mb-2">Faberlic Mining</h1>
          <p className="text-slate-600">Hesabınıza daxil olun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="login">Login</Label>
            <Input
              id="login"
              data-testid="login-input"
              type="text"
              placeholder="Login daxil edin"
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              required
              className="h-12 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
            />
          </div>

          <div>
            <Label htmlFor="password">Parol</Label>
            <Input
              id="password"
              data-testid="password-input"
              type="password"
              placeholder="Parol daxil edin"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="h-12 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
            />
          </div>

          <Button
            type="submit"
            data-testid="login-button"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-slate-900 font-bold text-base hover:shadow-xl transition-all active:scale-95"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Daxil ol
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Hesabınız yoxdur?{' '}
            <Link to="/register" className="text-[#D4AF37] font-semibold hover:underline">
              Qeydiyyat
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
