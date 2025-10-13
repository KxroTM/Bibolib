import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/api';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const HistoryPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reservations');
  const [searchQuery, setSearchQuery] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loans, setLoans] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);

  useEffect(() => {
    loadHistoryData();
  }, []);

  useEffect(() => {
    // Filtrer les données quand la recherche change
    filterData();
  }, [searchQuery, reservations, loans]);

  const loadHistoryData = async () => {
    try {
      setLoading(true);
      
      // Charger l'historique des réservations
      const reservationsResponse = await adminService.getReservations();
      setReservations(reservationsResponse.data || []);
      
      // Charger l'historique des emprunts (tous, pas seulement actifs)
      const loansResponse = await adminService.getAllLoans(); 
      setLoans(loansResponse.data || []);
      
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    const query = searchQuery.toLowerCase().trim();
    
    if (!query) {
      setFilteredReservations(reservations);
      setFilteredLoans(loans);
      return;
    }

    // Filtrer les réservations par nom d'utilisateur
    const filteredRes = reservations.filter(res =>
      (res.username || '').toLowerCase().includes(query) ||
      (res.user_email || '').toLowerCase().includes(query)
    );

    // Filtrer les emprunts par nom d'utilisateur
    const filteredLns = loans.filter(loan =>
      (loan.username || '').toLowerCase().includes(query) ||
      (loan.user_email || '').toLowerCase().includes(query)
    );

    setFilteredReservations(filteredRes);
    setFilteredLoans(filteredLns);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'cancelled': return 'Annulée';
      case 'expired': return 'Expirée';
      case 'pending': return 'En attente';
      default: return status || 'Inconnue';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="large" />
        <p className="mt-4 text-gray-600">Chargement de l'historique...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              📊 Historique des emprunts et réservations
            </h1>
            <p className="text-gray-600 mb-6">
              Consultez l'historique complet des réservations et emprunts des utilisateurs
            </p>

            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom d'utilisateur ou email..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🔍 Rechercher
                </button>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            </form>

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
                  📅 Réservations ({filteredReservations.length})
                </button>
                <button
                  onClick={() => setActiveTab('loans')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'loans'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📚 Emprunts ({filteredLoans.length})
                </button>
              </nav>
            </div>

            {/* Contenu des onglets */}
            {activeTab === 'reservations' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Historique des réservations
                </h2>
                
                {filteredReservations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery ? 'Aucune réservation trouvée pour cette recherche' : 'Aucune réservation dans l\'historique'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Utilisateur
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Livre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bibliothèque
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date de réservation
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date de confirmation
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredReservations.map((reservation) => (
                          <tr key={reservation.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {reservation.username}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {reservation.user_email}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {reservation.book_title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {reservation.book_author}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {reservation.library_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(reservation.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(reservation.confirmed_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                                {getStatusText(reservation.status)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'loans' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Historique des emprunts
                </h2>
                
                {filteredLoans.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery ? 'Aucun emprunt trouvé pour cette recherche' : 'Aucun emprunt dans l\'historique'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Utilisateur
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Livre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bibliothèque
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date d'emprunt
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date limite
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date de retour
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLoans.map((loan) => {
                          const isReturned = loan.returned_at;
                          const isOverdue = !isReturned && new Date(loan.return_due_date) < new Date();
                          
                          return (
                            <tr key={loan.id} className={`hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {loan.username}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {loan.user_email}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {loan.book_title}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {loan.book_author}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {loan.library_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(loan.picked_up_at)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(loan.return_due_date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {isReturned ? formatDate(loan.returned_at) : '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  isReturned 
                                    ? 'bg-green-100 text-green-800'
                                    : isOverdue 
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {isReturned ? 'Rendu' : isOverdue ? 'En retard' : 'En cours'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default HistoryPage;