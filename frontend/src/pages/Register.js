import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { API, AuthContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { UserPlus, Gem } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ login: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Parollar uyğun gəlmir');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Parol ən azı 6 simvoldan ibarət olmalıdır');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/register`, {
        login: formData.login,
        password: formData.password,
      });
      login(res.data.token, res.data.user);
      toast.success('Qeydiyyat uğurlu oldu!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Qeydiyyat uğursuz oldu');
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
          <p className="text-slate-600">Yeni hesab yaradın</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="login">Login</Label>
            <Input
              id="login"
              data-testid="register-login-input"
              type="text"
              placeholder="Login seçin"
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
              data-testid="register-password-input"
              type="password"
              placeholder="Parol yaradın"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="h-12 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Parol təkrar</Label>
            <Input
              id="confirmPassword"
              data-testid="register-confirm-password-input"
              type="password"
              placeholder="Parolu təkrar daxil edin"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className="h-12 bg-slate-50 border-slate-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
            />
          </div>

          <Button
            type="submit"
            data-testid="register-button"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-slate-900 font-bold text-base hover:shadow-xl transition-all active:scale-95"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Qeydiyyatdan keç
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Artıq hesabınız var?{' '}
            <Link to="/login" className="text-[#D4AF37] font-semibold hover:underline">
              Daxil ol
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
