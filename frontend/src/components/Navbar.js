import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, hasPermission } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Left: Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center">
                <img
                  src="/parislogo.png"
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-gray-800">Bibliothèque numérique</span>
            </Link>
          </div>

          {/* Center: Quick nav links (visible on md+) */}
          <div className="flex-1 flex justify-center">
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/livres" className="px-3 py-1 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2">
                <span className="text-sm font-medium">📖</span>
                <span className="text-sm">Livres</span>
              </Link>
              <Link to="/bibliotheques" className="px-3 py-1 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2">
                <span className="text-sm font-medium">🏛️</span>
                <span className="text-sm">Bibliothèques</span>
              </Link>
              {user && (
                <Link to="/mes-emprunts" className="px-3 py-1 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2">
                  <span className="text-sm font-medium">📚</span>
                  <span className="text-sm">Mes emprunts</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right: User actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600">
                  {(() => {
                    const base = user.username || user.name || (user.email ? user.email.split('@')[0] : '');
                    return base ? `Bonjour, ${base}` : 'Bonjour';
                  })()}
                  {isAdmin() && <span className="ml-2 px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">Admin</span>}
                  {!isAdmin() && (hasPermission('RESERVATION_MANAGE') || hasPermission('LIBRARY_MANAGE')) && (
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Bibliothécaire</span>
                  )}
                </span>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="px-3 py-1 rounded-full bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                {/* Boutons pour les permissions spécifiques (employés de bibliothèque ou admins) */}
                {hasPermission('RESERVATION_MANAGE') && (
                  <Link
                    to="/admin/reservations"
                    className="px-3 py-1 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    📋 Réservations
                  </Link>
                )}
                {hasPermission('RESERVATION_MANAGE') && (
                  <Link
                    to="/admin/loans"
                    className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    📚 Emprunts
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 rounded-full bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
              >
                <span className="mr-2">🔐</span>
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;