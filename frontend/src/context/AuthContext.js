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
    const init = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        // Pas de token -> pas d'utilisateur authentifié
        setUser(null);
        setLoading(false);
        return;
      }

      // Si token présent, tenter de récupérer l'utilisateur courant
      try {
        const res = await authService.me();
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch (err) {
        // Token invalide ou erreur : nettoyer
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
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