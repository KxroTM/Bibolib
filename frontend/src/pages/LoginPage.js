import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Rediriger si déjà connecté (après premier rendu uniquement pour éviter boucle pendant tentative login)
  if (user) {
    // Utiliser un micro-task pour éviter setState pendant render
    Promise.resolve().then(() => navigate('/admin'));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      const result = await login(email, password);
      
      if (result.success) {
        toast.success('Connexion réussie !');
        // Redirect back to where the user came from, if provided
        const from = location.state?.from;
        if (from) {
          navigate(from, { replace: true });
        } else {
          // default admin landing
          navigate('/admin');
        }
      } else {
        // Erreur logique retournée par authContext
        toast.error(result.error || 'Identifiants invalides');
      }
    } catch (error) {
      const apiMsg = error?.response?.data?.message;
      if (error?.response?.status === 401) {
        toast.error(apiMsg || 'Email ou mot de passe incorrect');
      } else {
        toast.error(apiMsg || 'Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  // Bouton démo supprimé

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">🔐</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Bienvenue sur Bibliothèque numérique
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous pour accéder aux bibliothèques parisiennes
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field mt-1"
                placeholder="admin@bibolib.fr"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field mt-1"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader size="small" />
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    🔑
                  </span>
                  Se connecter
                </>
              )}
            </button>
          </div>

          {/* Bouton démo retiré */}

          <div className="text-center space-y-3">
            <p className="text-sm">
              <span className="text-gray-600 mr-1">Pas encore de compte ?</span>
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;