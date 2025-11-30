import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import '@/App.css';

// Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';
import Orders from '@/pages/Orders';
import Mining from '@/pages/Mining';
import Spin from '@/pages/Spin';
import Deposit from '@/pages/Deposit';
import Withdraw from '@/pages/Withdraw';
import History from '@/pages/History';
import Profile from '@/pages/Profile';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminVIP from '@/pages/admin/AdminVIP';
import AdminVIPCreate from '@/pages/admin/AdminVIPCreate';
import AdminCampaigns from '@/pages/admin/AdminCampaigns';
import AdminWithdrawals from '@/pages/admin/AdminWithdrawals';
import AdminNotifications from '@/pages/admin/AdminNotifications';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Axios interceptor for auth
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Refresh user data
      axios.get(`${API}/auth/me`)
        .then(res => {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Çıxış edildi');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin' : '/'} />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin' : '/'} />} />
            
            {/* User routes */}
            <Route path="/" element={user && user.role === 'user' ? <Home /> : <Navigate to="/login" />} />
            <Route path="/orders" element={user && user.role === 'user' ? <Orders /> : <Navigate to="/login" />} />
            <Route path="/mining" element={user && user.role === 'user' ? <Mining /> : <Navigate to="/login" />} />
            <Route path="/spin" element={user && user.role === 'user' ? <Spin /> : <Navigate to="/login" />} />
            <Route path="/deposit" element={user && user.role === 'user' ? <Deposit /> : <Navigate to="/login" />} />
            <Route path="/withdraw" element={user && user.role === 'user' ? <Withdraw /> : <Navigate to="/login" />} />
            <Route path="/history" element={user && user.role === 'user' ? <History /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user && user.role === 'user' ? <Profile /> : <Navigate to="/login" />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route path="/admin/users" element={user && user.role === 'admin' ? <AdminUsers /> : <Navigate to="/login" />} />
            <Route path="/admin/vip" element={user && user.role === 'admin' ? <AdminVIP /> : <Navigate to="/login" />} />
            <Route path="/admin/vip/create" element={user && user.role === 'admin' ? <AdminVIPCreate /> : <Navigate to="/login" />} />
            <Route path="/admin/campaigns" element={user && user.role === 'admin' ? <AdminCampaigns /> : <Navigate to="/login" />} />
            <Route path="/admin/withdrawals" element={user && user.role === 'admin' ? <AdminWithdrawals /> : <Navigate to="/login" />} />
            <Route path="/admin/notifications" element={user && user.role === 'admin' ? <AdminNotifications /> : <Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
