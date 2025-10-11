import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { adminService } from '../services/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const AdminReservationsPage = () => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [pendingReservations, setPendingReservations] = useState([]);
  const [pendingExtensions, setPendingExtensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('reservations');
  
  // États pour la recherche
  const [searchUsername, setSearchUsername] = useState('');
  const [searchBook, setSearchBook] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (user && hasPermission('RESERVATION_VIEW')) {
      loadData();
    }
  }, [user, hasPermission]);

  const loadData = async (username = '', book = '') => {
    try {
      setSearching(true);
      setError('');
      
      // Charger les réservations en attente avec paramètres de recherche
      const reservationsResponse = await adminService.getPendingReservations({
        username: username.trim() || undefined,
        book: book.trim() || undefined
      });
      setPendingReservations(reservationsResponse.data || []);
      
      // Charger les demandes de prolongation
      const extensionsResponse = await adminService.getPendingExtensions();
      setPendingExtensions(extensionsResponse.data || []);
      
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

  const handleRejectReservation = async (reservationId) => {
    const reason = prompt('Raison du rejet (optionnel):');
    if (reason === null) return; // Utilisateur a annulé
    
    try {
      await adminService.rejectReservation(reservationId, reason);
      await loadData(searchUsername, searchBook);
      toast.success('Pré-réservation rejetée avec succès');
    } catch (err) {
      
      toast.error(err.response?.data?.message || 'Erreur lors du rejet');
    }
  };

  const handleValidatePickup = async (reservationId) => {
    try {
      await adminService.validatePickup(reservationId);
      await loadData(searchUsername, searchBook);
      toast.success('Emprunt validé avec succès');
    } catch (err) {
      
      toast.error(err.response?.data?.message || 'Erreur lors de la validation');
    }
  };

  const handleGrantExtension = async (reservationId, days = 30) => {
    try {
      await adminService.grantExtension(reservationId, days);
      await loadData();
      toast.success(`Prolongation de ${days} jours accordée`);
    } catch (err) {
      
      toast.error(err.response?.data?.message || 'Erreur lors de l\'accord de prolongation');
    }
  };

  const handleDenyExtension = async (reservationId) => {
    try {
      await adminService.denyExtension(reservationId);
      await loadData();
      toast.success('Demande de prolongation refusée');
    } catch (err) {
      
      toast.error(err.response?.data?.message || 'Erreur lors du refus');
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

  const isExpiringSoon = (expiresAt) => {
    const hours = (new Date(expiresAt) - new Date()) / (1000 * 60 * 60);
    return hours <= 24; // Expire dans moins de 24h
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

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des réservations</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Onglets */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reservations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Validations en attente ({pendingReservations.length})
            </button>
            <button
              onClick={() => setActiveTab('extensions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'extensions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Prolongations demandées ({pendingExtensions.length})
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Pré-réservations à valider</h2>
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
            
            {pendingReservations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">Aucune validation en attente</div>
                <p className="text-gray-400 mt-2">Toutes les pré-réservations ont été traitées</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {pendingReservations.map((reservation) => {
                  const expiringSoon = isExpiringSoon(reservation.due_date);
                  
                  return (
                    <div key={reservation.id} className={`bg-white border rounded-lg p-6 shadow-sm ${
                      expiringSoon ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                    }`}>
                      {expiringSoon && (
                        <div className="bg-orange-100 border border-orange-300 text-orange-700 px-3 py-2 rounded mb-4">
                          ⚠️ Cette pré-réservation expire bientôt !
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Informations du livre */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {reservation.book_title}
                          </h3>
                          <p className="text-gray-600 mb-1">par {reservation.book_author}</p>
                          <p className="text-gray-500 text-sm mb-4">Bibliothèque: {reservation.library_name}</p>
                          
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Pré-réservé le:</span>
                              <p className="text-gray-600">{formatDate(reservation.reserved_at)}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Expire le:</span>
                              <p className={`${expiringSoon ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
                                {formatDate(reservation.due_date)}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Adresse:</span>
                              <p className="text-gray-600">{reservation.library_address}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Informations de l'utilisateur */}
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 mb-2">Utilisateur</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Nom d'utilisateur:</span>
                              <p className="text-gray-600">{reservation.username}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Email:</span>
                              <p className="text-gray-600">{reservation.user_email}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {hasPermission('RESERVATION_MANAGE') && (
                              <>
                                <button
                                  onClick={() => handleValidatePickup(reservation.id)}
                                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  ✅ Valider le retrait (commencer l'emprunt)
                                </button>
                                <button
                                  onClick={() => handleRejectReservation(reservation.id)}
                                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  ❌ Rejeter la pré-réservation
                                </button>
                              </>
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
        )}

        {activeTab === 'extensions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Demandes de prolongation</h2>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Actualiser
              </button>
            </div>
            
            {pendingExtensions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">Aucune demande de prolongation</div>
                <p className="text-gray-400 mt-2">Toutes les demandes ont été traitées</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {pendingExtensions.map((extension) => {
                  const dueDate = new Date(extension.return_due_date);
                  const isOverdue = dueDate < new Date();
                  
                  return (
                    <div key={extension.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Informations du livre et de l'emprunt */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {extension.book_title}
                          </h3>
                          <p className="text-gray-600 mb-1">par {extension.book_author}</p>
                          
                          <div className="space-y-2 text-sm mt-4">
                            <div>
                              <span className="font-medium text-gray-700">Emprunté le:</span>
                              <p className="text-gray-600">{formatDate(extension.picked_up_at)}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">À rendre le:</span>
                              <p className={`${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                                {formatDate(extension.return_due_date)}
                                {isOverdue && <span className="block text-red-600">⚠️ En retard</span>}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Informations de l'utilisateur et actions */}
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 mb-2">Utilisateur</h4>
                          <p className="text-gray-600 text-sm mb-4">{extension.username}</p>
                          
                          <div className="space-y-3">
                            <button
                              onClick={() => handleGrantExtension(extension.id, 30)}
                              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                              ✅ Accorder 30 jours
                            </button>
                            <button
                              onClick={() => handleGrantExtension(extension.id, 15)}
                              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              📅 Accorder 15 jours
                            </button>
                            <button
                              onClick={() => handleDenyExtension(extension.id)}
                              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              ❌ Refuser la prolongation
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservationsPage;
