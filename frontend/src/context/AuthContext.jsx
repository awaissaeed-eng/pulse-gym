import { useState } from 'react';
import api from '../libraries/api';
import { AuthContext } from './contextValue';

export function AuthProvider({ children }) {
  const [{ user, token }, setSession] = useState(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (!savedToken || !savedUser) {
      return { user: null, token: null };
    }

    try {
      return { user: JSON.parse(savedUser), token: savedToken };
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { user: null, token: null };
    }
  });

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    setSession({ token, user });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const signup = async (name, email, password) => {
    await api.post('/auth/signup', { name, email, password });
    await login(email, password);
  };

  const logout = () => {
    setSession({ user: null, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn: !!user, login, signup, logout, isLoading: false }}>
      {children}
    </AuthContext.Provider>
  );
}
