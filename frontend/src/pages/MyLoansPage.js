import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../services/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const MyLoansPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const bookIdParam = searchParams.get('bookId');
  const [loans, setLoans] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('loans');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  useEffect(() => {
    // Si un bookId est spécifié, basculer sur l'onglet réservations
    if (bookIdParam) {
      setActiveTab('reservations');
    }
  }, [bookIdParam]);

  useEffect(() => {
    // Filtrer les réservations selon le bookId si spécifié
    if (bookIdParam) {
      const filtered = reservations.filter(res => res.book_id === parseInt(bookIdParam));
      setFilteredReservations(filtered);
    } else {
      setFilteredReservations(reservations);
    }
  }, [reservations, bookIdParam]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Charger les emprunts actuels
      const loansResponse = await adminService.getMyLoans();
      setLoans(loansResponse.data || []);
      
      // Charger toutes les réservations (incluant pré-réservations)
      const reservationsResponse = await adminService.getMyReservations();
      setReservations(reservationsResponse.data || []);
      
    } catch (err) {
      
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestExtension = async (reservationId) => {
    try {
      await adminService.requestExtension(reservationId);
      await loadUserData(); // Recharger les données
      toast.success('Demande de prolongation envoyée avec succès');
    } catch (err) {
      
      toast.error(err.response?.data?.message || 'Erreur lors de la demande de prolongation');
    }
  };

  const handleCancelReservation = async (bookId) => {
    try {
      await adminService.cancelReservation(bookId);
      await loadUserData(); // Recharger les données
      toast.success('Réservation annulée avec succès');
    } catch (err) {
      
      toast.error(err.response?.data?.message || 'Erreur lors de l\'annulation');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pre_reserved': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Pré-réservé' },
      'borrowed': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Emprunté' },
      'returned': { bg: 'bg-green-100', text: 'text-green-800', label: 'Rendu' },
      'expired': { bg: 'bg-red-100', text: 'text-red-800', label: 'Expiré' },
      'cancelled': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Annulé' }
    };
    
    const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes emprunts et réservations</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Onglets */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('loans')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'loans'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Emprunts actuels ({loans.length})
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reservations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {bookIdParam ? `Réservation pour ce livre (${filteredReservations.length})` : `Toutes mes réservations (${reservations.length})`}
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'loans' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Emprunts en cours</h2>
            
            {loans.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">Aucun emprunt en cours</div>
                <p className="text-gray-400 mt-2">Vous pouvez emprunter des livres depuis la page de recherche</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {loans.map((loan) => {
                  const daysRemaining = getDaysRemaining(loan.return_due_date);
                  const overdue = isOverdue(loan.return_due_date);
                  
                  return (
                    <div key={loan.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{loan.book_title}</h3>
                          <p className="text-gray-600">par {loan.book_author}</p>
                          <p className="text-gray-500 text-sm">{loan.book_publisher}</p>
                        </div>
                        {getStatusBadge(loan.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Emprunté le:</span>
                          <p className="text-gray-600">{formatDate(loan.picked_up_at)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">À rendre avant:</span>
                          <p className={`${overdue ? 'text-red-600 font-medium' : daysRemaining <= 7 ? 'text-orange-600' : 'text-gray-600'}`}>
                            {formatDate(loan.return_due_date)}
                            {daysRemaining !== null && (
                              <span className="block">
                                {overdue ? `Retard de ${Math.abs(daysRemaining)} jour${Math.abs(daysRemaining) > 1 ? 's' : ''}` :
                                 daysRemaining === 0 ? 'À rendre aujourd\'hui' :
                                 `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}`}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {loan.extension_requested ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              ⏳ Prolongation demandée
                            </span>
                          ) : daysRemaining <= 7 && daysRemaining > 0 && (
                            <button
                              onClick={() => handleRequestExtension(loan.id)}
                              className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded hover:bg-orange-200 transition-colors"
                            >
                              📅 Demander une prolongation
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {bookIdParam ? 'Réservation pour ce livre' : 'Historique des réservations'}
              </h2>
              {bookIdParam && (
                <button
                  onClick={() => window.location.href = '/mes-emprunts'}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  📋 Voir toutes mes réservations
                </button>
              )}
            </div>
            
            {filteredReservations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">
                  {bookIdParam ? 'Aucune réservation pour ce livre' : 'Aucune réservation'}
                </div>
                <p className="text-gray-400 mt-2">
                  {bookIdParam ? 'Vous n\'avez pas de réservation pour ce livre' : 'Vos réservations apparaîtront ici'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredReservations.map((reservation) => {
                  const canCancel = reservation.status === 'pre_reserved' && !isOverdue(reservation.due_date);
                  
                  return (
                    <div key={reservation.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{reservation.book_title}</h3>
                          <p className="text-gray-600">par {reservation.book_author}</p>
                          <p className="text-gray-500 text-sm">{reservation.book_publisher}</p>
                          {reservation.library_name && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                              <p className="font-medium text-blue-800">📍 Bibliothèque:</p>
                              <p className="text-blue-700">{reservation.library_name}</p>
                              {reservation.library_address && (
                                <p className="text-blue-600 text-xs">{reservation.library_address}</p>
                              )}
                              {reservation.library_arrondissement && (
                                <p className="text-blue-600 text-xs">{reservation.library_arrondissement}e arrondissement</p>
                              )}
                            </div>
                          )}
                        </div>
                        {getStatusBadge(reservation.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Réservé le:</span>
                          <p className="text-gray-600">{formatDate(reservation.reserved_at)}</p>
                        </div>
                        
                        {reservation.status === 'pre_reserved' && (
                          <div>
                            <span className="font-medium text-gray-700">À récupérer avant:</span>
                            <p className={`${isOverdue(reservation.due_date) ? 'text-red-600 font-medium' : 'text-orange-600'}`}>
                              {formatDate(reservation.due_date)}
                            </p>
                          </div>
                        )}
                        
                        {reservation.picked_up_at && (
                          <div>
                            <span className="font-medium text-gray-700">Récupéré le:</span>
                            <p className="text-gray-600">{formatDate(reservation.picked_up_at)}</p>
                          </div>
                        )}
                        
                        {reservation.returned_at && (
                          <div>
                            <span className="font-medium text-gray-700">Rendu le:</span>
                            <p className="text-gray-600">{formatDate(reservation.returned_at)}</p>
                          </div>
                        )}
                        
                        <div className="flex flex-col gap-2">
                          {canCancel && (
                            <button
                              onClick={() => handleCancelReservation(reservation.book_id)}
                              className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors"
                            >
                              ❌ Annuler la réservation
                            </button>
                          )}
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

export default MyLoansPage;
