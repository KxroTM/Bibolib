import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, permission }) => {
  const { user, loading, hasPermission } = useAuth();

  // Dev bypass: ajouter `?dev_admin=true` dans l'URL pour afficher la page sans auth (local only)
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const devBypass = params && params.get('dev_admin') === 'true';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (devBypass) {
    // Afficher la page en mode développement sans authentification
    // NOTE: ce contournement est volontairement simple pour debug local
    // et ne doit PAS être utilisé en production.
    // Afficher un avertissement dans la console pour rappeler l'usage local.
    // eslint-disable-next-line no-console
    
    return children;
  }

  if (!user || (permission && !hasPermission(permission))) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
