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

  // Rediriger si déjà connecté
  if (user) {
    navigate('/admin');
    return null;
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
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@bibolib.fr');
    setPassword('admin123');
  };

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
            Bienvenue sur BiboLib
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

          {/* Bouton de démonstration */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="mr-2">🎯</span>
              Utiliser les identifiants de démonstration
            </button>
          </div>

          {/* Informations de test */}
          <div className="mt-6 space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                � Compte Administrateur
              </h3>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Email :</strong> admin@bibolib.fr</p>
                <p><strong>Mot de passe :</strong> admin123</p>
                <p className="mt-2 text-blue-600">
                  Accès complet à l'interface d'administration.
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 mb-2">
                📚 Comptes Utilisateurs
              </h3>
              <div className="text-xs text-green-700 space-y-2">
                <div>
                  <p><strong>Jean Martin :</strong> jean.martin@gmail.com / jean123</p>
                  <p><strong>Sophie Leroy :</strong> sophie.leroy@yahoo.fr / sophie123</p>
                  <p><strong>Paul Durand :</strong> paul.durand@hotmail.fr / paul123</p>
                  <p><strong>Emma Bernard :</strong> emma.bernard@gmail.com / emma123</p>
                </div>
                <p className="mt-2 text-green-600">
                  Accès aux bibliothèques et catalogues de livres.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Connexion requise pour accéder au site
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;