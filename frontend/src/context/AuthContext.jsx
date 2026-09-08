import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Bootstrap from localStorage on first load
  useEffect(() => {
    const savedToken = localStorage.getItem('voyago_token');
    const savedUser  = localStorage.getItem('voyago_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    localStorage.setItem('voyago_token', t);
    localStorage.setItem('voyago_user', JSON.stringify(u));
    return u;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    localStorage.setItem('voyago_token', t);
    localStorage.setItem('voyago_user', JSON.stringify(u));
    return u;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('voyago_token');
    localStorage.removeItem('voyago_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
