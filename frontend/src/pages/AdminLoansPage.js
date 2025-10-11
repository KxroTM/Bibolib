import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { adminService } from '../services/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const AdminLoansPage = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [activeLoans, setActiveLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // États pour la recherche
  const [searchUsername, setSearchUsername] = useState('');
  const [searchBook, setSearchBook] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (user && user.permissions?.includes('RESERVATION_MANAGE')) {
      loadData();
    }
  }, [user]); // Retire hasPermission des dépendances

  const loadData = async (username = '', book = '') => {
    try {
      setSearching(true);
      setError('');
      
      // Charger les emprunts actifs avec paramètres de recherche
      const loansResponse = await adminService.getActiveLoans({
        username: username.trim() || undefined,
        book: book.trim() || undefined
      });
      
      setActiveLoans(loansResponse.data || []);
      
    } catch (err) {
      
      setError('Erreur lors du chargement des données');
    } finally {
      setSearching(false);
      if (!username && !book) {
        setLoading(false);
      }
    }
  };

  const handleSearch = () => {
    loadData(searchUsername, searchBook);
  };

  const handleResetSearch = () => {
    setSearchUsername('');
    setSearchBook('');
    loadData('', '');
  };

  const handleReturnBook = async (loanId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir marquer ce livre comme rendu ?')) {
      return;
    }
    
    try {
      await adminService.returnLoan(loanId);
      await loadData(searchUsername, searchBook);
      toast.success('Livre marqué comme rendu avec succès');
    } catch (err) {
      
      toast.error(err.response?.data?.message || 'Erreur lors du retour du livre');
    }
  };

  const handleAddPenalty = async (loan) => {
    const reason = prompt('Raison de la pénalité :', 'Retard de retour de livre');
    if (!reason) return;
    
    if (!window.confirm(`Ajouter une pénalité à ${loan.username} pour "${reason}" ?`)) {
      return;
    }
    
    try {
      const response = await adminService.addPenalty(loan.id, { reason });
      
      if (response.data.user_sanctioned) {
        toast.success(`${response.data.message} L'utilisateur a été automatiquement sanctionné.`);
      } else {
        toast.success(`${response.data.message} (${response.data.active_penalty_count}/3 pénalités)`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout de la pénalité');
    } finally {
      // Toujours recharger les données pour mettre à jour l'interface
      await loadData(searchUsername, searchBook);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (returnDueDate) => {
    return new Date(returnDueDate) < new Date();
  };

  const isDueSoon = (returnDueDate) => {
    const days = (new Date(returnDueDate) - new Date()) / (1000 * 60 * 60 * 24);
    return days <= 3 && days > 0; // Moins de 3 jours
  };

  if (!user?.permissions?.includes('RESERVATION_MANAGE')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Emprunts</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Emprunts actifs ({activeLoans.length})</h2>
            <button
              onClick={() => loadData(searchUsername, searchBook)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={searching}
            >
              {searching ? '🔄 Recherche...' : '🔄 Actualiser'}
            </button>
          </div>

          {/* Interface de recherche */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rechercher</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="searchUsername" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  id="searchUsername"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  placeholder="Rechercher par nom d'utilisateur..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div>
                <label htmlFor="searchBook" className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du livre
                </label>
                <input
                  type="text"
                  id="searchBook"
                  value={searchBook}
                  onChange={(e) => setSearchBook(e.target.value)}
                  placeholder="Rechercher par titre de livre..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex items-end space-x-2">
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  {searching ? 'Recherche...' : 'Rechercher'}
                </button>
                <button
                  onClick={handleResetSearch}
                  disabled={searching}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
          
          {activeLoans.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">Aucun emprunt actif</div>
              <p className="text-gray-400 mt-2">Tous les livres ont été rendus</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {activeLoans.map((loan) => {
                const overdue = isOverdue(loan.return_due_date);
                const dueSoon = isDueSoon(loan.return_due_date);
                
                return (
                  <div key={loan.id} className={`bg-white border rounded-lg p-6 shadow-sm ${
                    overdue ? 'border-red-300 bg-red-50' : dueSoon ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
                  }`}>
                    {overdue && (
                      <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded mb-4">
                        🚨 Ce livre est en retard !
                      </div>
                    )}
                    {dueSoon && !overdue && (
                      <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 px-3 py-2 rounded mb-4">
                        ⚠️ Ce livre doit être rendu bientôt !
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Informations du livre */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {loan.book_title}
                        </h3>
                        <p className="text-gray-600 mb-1">par {loan.book_author}</p>
                        <p className="text-gray-500 text-sm mb-4">Bibliothèque: {loan.library_name}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Emprunté le:</span>
                            <p className="text-gray-600">{formatDate(loan.picked_up_at)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">À rendre le:</span>
                            <p className={`${overdue ? 'text-red-600 font-medium' : dueSoon ? 'text-yellow-600 font-medium' : 'text-gray-600'}`}>
                              {formatDate(loan.return_due_date)}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Adresse:</span>
                            <p className="text-gray-600">{loan.library_address}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Informations de l'utilisateur */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-2">Emprunteur</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Nom d'utilisateur:</span>
                            <p className="text-gray-600">{loan.username}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Email:</span>
                            <p className="text-gray-600">{loan.user_email}</p>
                          </div>
                        </div>
                        
                        <div className="mt-6 space-y-3">
                          {hasPermission('LOAN_MANAGE') && (
                            <button
                              onClick={() => handleReturnBook(loan.id)}
                              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                              📚 Marquer comme rendu
                            </button>
                          )}
                          
                          {/* Bouton de pénalité pour les livres en retard */}
                          {overdue && !Boolean(loan.has_active_penalty) && hasPermission('LOAN_MANAGE') && (
                            <button
                              onClick={() => handleAddPenalty(loan)}
                              className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                            >
                              <span>⚠️</span>
                              <span>Ajouter une pénalité (retard)</span>
                            </button>
                          )}
                          
                          {/* Indicateur si pénalité déjà appliquée */}
                          {overdue && Boolean(loan.has_active_penalty) && (
                            <div className="w-full bg-red-100 text-red-800 px-4 py-2 rounded-lg border border-red-300 flex items-center justify-center space-x-2">
                              <span>⛔</span>
                              <span>Pénalité déjà appliquée</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLoansPage;
