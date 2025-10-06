import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialisation simple : si token présent on attend le login explicite plus tard
  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      try { setUser(JSON.parse(rawUser)); } catch { /* noop */ }
    }
    // tenter une récupération des infos permissions si token
    const token = localStorage.getItem('token');
    if (token) {
      authService.me().then(res => {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      }).catch(() => {/* ignore, token peut être invalide */});
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
    const response = await authService.login(email, password);
    const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erreur de connexion' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = () => {
    return user && (user.role === 'admin' || (user.roles && user.roles.includes('admin')));
  };

  const hasPermission = (perm) => {
    return !!(user && user.permissions && user.permissions.includes(perm));
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
    hasPermission,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};