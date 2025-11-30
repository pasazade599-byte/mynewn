import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/App';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Bell } from 'lucide-react';
import { toast } from 'sonner';

const AdminNotifications = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!title || !message) {
      toast.error('Bütün saheləri doldurun');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/admin/notifications?title=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}`);
      toast.success('Bildiriş göndərildi');
      setTitle('');
      setMessage('');
    } catch (error) {
      toast.error('Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-b-3xl shadow-xl mb-6">
        <div className="flex items-center gap-4">
          <Button
            data-testid="back-button"
            onClick={() => navigate('/admin')}
            variant="ghost"
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold playfair">Bildiriş Göndər</h1>
            <p className="text-slate-300 text-sm">Bütün istifadəçilərə bildiriş</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Yeni Bildiriş</h3>
              <p className="text-sm text-slate-600">Bütün aktiv istifadəçilərə göndəriləcək</p>
            </div>
          </div>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <Label htmlFor="title">Başlıq</Label>
              <Input
                id="title"
                data-testid="notification-title-input"
                type="text"
                placeholder="Bildiriş başlığı"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-12 bg-slate-50 border-slate-200"
              />
            </div>

            <div>
              <Label htmlFor="message">Mesaj</Label>
              <Textarea
                id="message"
                data-testid="notification-message-input"
                placeholder="Bildiriş mesajını daxil edin..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="bg-slate-50 border-slate-200 resize-none"
              />
            </div>

            <Button
              type="submit"
              data-testid="send-notification-button"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:shadow-xl transition-all active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Bildiriş göndər
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Info */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">İnfo</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Bildiriş bütün aktiv istifadəçilərə göndəriləcək</li>
            <li>• İstifadəçilər ana səhifədə bildirişi görəcəklər</li>
            <li>• Diqqətli olun, göndərdiyiniz mesaj dəyişməz</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AdminNotifications;
