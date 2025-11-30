import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { API, AuthContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent_50%)]" />
      
      <div className="relative z-10 w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-[1.5rem] p-1">
            <div className="w-full h-full bg-slate-950 rounded-[1.3rem] flex items-center justify-center">
              <Gem className="w-10 h-10 text-amber-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold playfair text-amber-500 mb-2">Faberlic Mining</h1>
          <p className="text-slate-400">Hesabınıza daxil olun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-400">Login</Label>
            <Input
              id="login"
              data-testid="login-input"
              type="text"
              placeholder="Login daxil edin"
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              required
              className="h-12 bg-slate-950 border-slate-800 text-white rounded-xl"
            />
          </div>

          <div>
            <Label className="text-slate-400">Parol</Label>
            <Input
              id="password"
              data-testid="password-input"
              type="password"
              placeholder="Parol daxil edin"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="h-12 bg-slate-950 border-slate-800 text-white rounded-xl"
            />
          </div>

          <Button
            type="submit"
            data-testid="login-button"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Daxil ol
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Hesabınız yoxdur?{' '}
            <Link to="/register" className="text-amber-500 font-semibold hover:underline">
              Qeydiyyat
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
