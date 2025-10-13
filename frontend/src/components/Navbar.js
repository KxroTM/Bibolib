import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Vérifier s'il y a des permissions admin/employé
  const hasAdminOrEmployeePermissions = isAdmin() || hasPermission('RESERVATION_MANAGE') || hasPermission('LOAN_MANAGE') || hasPermission('ADMIN_LOGS');

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
                {/* Menu déroulant Administration/Gestion */}
                {hasAdminOrEmployeePermissions && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="px-3 py-1 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-1"
                    >
                      <span>⚙️ Administration</span>
                      <svg className={`w-4 h-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          {isAdmin() && (
                            <Link
                              to="/admin"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <span className="mr-3">📊</span>
                              Dashboard Principal
                            </Link>
                          )}
                          
                          {hasPermission('RESERVATION_MANAGE') && (
                            <Link
                              to="/admin/reservations"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <span className="mr-3">📋</span>
                              Réservations
                            </Link>
                          )}
                          
                          {hasPermission('RESERVATION_MANAGE') && (
                            <Link
                              to="/admin/loans"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <span className="mr-3">📚</span>
                              Emprunts Actifs
                            </Link>
                          )}
                          
                          {hasPermission('LOAN_MANAGE') && (
                            <Link
                              to="/admin/history"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <span className="mr-3">📊</span>
                              Historique
                            </Link>
                          )}
                          
                          {hasPermission('ADMIN_LOGS') && (
                            <Link
                              to="/admin/logs"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            >
                              <span className="mr-3">📋</span>
                              Logs système
                            </Link>
                          )}
                          
                          {hasPermission('SYSTEM_MAINTENANCE') && (
                            <Link
                              to="/system/maintenance"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-t border-gray-100"
                            >
                              <span className="mr-3">🛠️</span>
                              Maintenance Système
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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