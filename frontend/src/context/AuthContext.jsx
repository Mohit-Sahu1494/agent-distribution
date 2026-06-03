import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // Loading until we verify token

  // On mount: load stored admin and verify token
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const stored = localStorage.getItem('admin');

      if (token && stored) {
        try {
          // Set cached data first to avoid flicker
          setAdmin(JSON.parse(stored));
          setLoading(false); // Stop loading immediately if we have cached data

          // Verify token in background
          const res = await api.get('/auth/me');
          const verifiedAdmin = res.data.admin;
          
          setAdmin(verifiedAdmin);
          localStorage.setItem('admin', JSON.stringify(verifiedAdmin));
        } catch {
          // Token invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('admin');
          setAdmin(null);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, admin: adminData } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(adminData));
    setAdmin(adminData);

    return res.data;
  }, []);

  const register = useCallback(async (email, password) => {
    const res = await api.post('/auth/register', { email, password });
    const { token, admin: adminData } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(adminData));
    setAdmin(adminData);

    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setAdmin(null);
  }, []);

  const value = {
    admin,
    loading,
    isAuthenticated: !!admin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
