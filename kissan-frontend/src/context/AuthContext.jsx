import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [is_loading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('kissan_token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    api.getProfile()
      .then(setUser)
      .catch(() => localStorage.removeItem('kissan_token'))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email, password) => {
    const result = await api.login({ email, password });
    localStorage.setItem('kissan_token', result.token);
    setUser(result.user);
    return result.user;
  };

  const register = async (form_data) => {
    const result = await api.register(form_data);
    localStorage.setItem('kissan_token', result.token);
    setUser(result.user);
    return result.user;
  };

  const logout = () => {
    localStorage.removeItem('kissan_token');
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    is_loading,
    is_authenticated: Boolean(user),
    login,
    register,
    logout,
  }), [user, is_loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
