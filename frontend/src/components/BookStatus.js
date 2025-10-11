import React from 'react';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { useNavigate } from 'react-router-dom';
import ReservationTimer from './ReservationTimer';

const BookStatus = ({ book, onReserve, onCancelReservation, onBorrow, onReturn, onRequestExtension }) => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  
  const getStatusDisplay = () => {
    switch (book.status) {
      case 'available':
        return {
          color: 'green',
          icon: '✅',
          text: 'Disponible',
          bgClass: 'bg-green-50 border-green-200',
          textClass: 'text-green-800'
        };
      case 'pre_reserved':
        const isMyPreReservation = book.reserved_by_user_id === user?.id;
        return {
          color: 'orange',
          icon: '⏰',
          text: isMyPreReservation ? 'Pré-réservé par vous' : 'Pré-réservé',
          bgClass: isMyPreReservation ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200',
          textClass: isMyPreReservation ? 'text-orange-800' : 'text-yellow-800'
        };
      case 'reserved':
        const isMyReservation = book.reserved_by_user_id === user?.id;
        return {
          color: 'orange',
          icon: '⏳',
          text: isMyReservation ? 'Réservé par vous' : 'Réservé',
          bgClass: isMyReservation ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200',
          textClass: isMyReservation ? 'text-orange-800' : 'text-yellow-800'
        };
      case 'borrowed':
        const isMyBorrow = book.reserved_by_user_id === user?.id;
        return {
          color: 'blue',
          icon: '📚',
          text: isMyBorrow ? 'Emprunté par vous' : 'Emprunté',
          bgClass: isMyBorrow ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200',
          textClass: isMyBorrow ? 'text-blue-800' : 'text-red-800'
        };
      case 'returned':
        return {
          color: 'green',
          icon: '✅',
          text: 'Rendu (disponible)',
          bgClass: 'bg-green-50 border-green-200',
          textClass: 'text-green-800'
        };
      case 'expired':
        return {
          color: 'red',
          icon: '❌',
          text: 'Pré-réservation expirée',
          bgClass: 'bg-red-50 border-red-200',
          textClass: 'text-red-800'
        };
      default:
        return {
          color: 'gray',
          icon: '❓',
          text: 'Statut inconnu',
          bgClass: 'bg-gray-50 border-gray-200',
          textClass: 'text-gray-800'
        };
    }
  };

  const status = getStatusDisplay();
  const isMyPreReservation = book.status === 'pre_reserved' && book.reservedBy === user?.id;
  const isMyReservation = book.status === 'reserved' && book.reservedBy === user?.id;
  const isMyBorrow = book.status === 'borrowed' && book.borrowedBy === user?.id;

  const renderActions = () => {
    // Vérifier si l'utilisateur peut réserver
    if (!user) {
      return (
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Connectez-vous pour réserver ce livre</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full btn-primary text-sm py-2"
          >
            Se connecter
          </button>
        </div>
      );
    }

    if (!hasPermission('RESERVATION_CREATE')) {
      return (
        <div className="bg-red-50 border border-red-200 p-3 rounded">
          <div className="text-red-800 text-sm text-center">
            <p className="font-semibold">⚠️ Réservations suspendues</p>
            <p className="mt-1">Votre compte ne permet pas les réservations.</p>
            <p className="text-xs mt-2">Contactez votre bibliothèque pour plus d'informations.</p>
          </div>
        </div>
      );
    }

    if (book.status === 'available') {
      return (
        <div className="space-y-2">
          <button
            onClick={() => onReserve(book.id)}
            className="w-full btn-primary text-sm py-2"
          >
            🔖 Pré-réserver (3 jours)
          </button>
        </div>
      );
    }

    if (book.status === 'pre_reserved') {
      const isMyPreReservation = book.reserved_by_user_id === user?.id;
      if (isMyPreReservation) {
        return (
          <div className="space-y-3">
            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
              <p>Vous avez 3 jours pour récupérer ce livre en bibliothèque.</p>
              {book.pickup_deadline && <ReservationTimer deadline={book.pickup_deadline} />}
            </div>
            <button
              onClick={() => onCancelReservation(book.id)}
              className="w-full btn-secondary text-sm py-2"
            >
              ❌ Annuler la pré-réservation
            </button>
            <button
              onClick={() => navigate(`/mes-emprunts?bookId=${book.id}`)}
              className="w-full bg-blue-100 text-blue-700 text-sm py-2 rounded hover:bg-blue-200 transition-colors"
            >
              📋 Voir la réservation
            </button>
          </div>
        );
      } else {
        return (
          <div className="text-center space-y-2">
            <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
              Ce livre est pré-réservé par un autre utilisateur
            </div>
          </div>
        );
      }
    }

    if (book.status === 'reserved') {
      const isMyReservation = book.reserved_by_user_id === user?.id;
      if (isMyReservation) {
        return (
          <div className="space-y-3">
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              <p>Livre validé pour emprunt - 1 mois.</p>
              {book.return_due_date && (
                <p className="mt-1">À rendre avant: {new Date(book.return_due_date).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        );
      } else {
        return (
          <div className={`${status.bgClass} border rounded-lg p-3 text-center`}>
            <span className={`${status.textClass} text-sm font-medium`}>
              {status.icon} Livre réservé par un autre utilisateur
            </span>
          </div>
        );
      }
    }

    if (book.status === 'borrowed') {
      const isMyBorrow = book.reserved_by_user_id === user?.id;
      if (isMyBorrow) {
        const dueDate = new Date(book.return_due_date || book.dueDate);
        const isOverdue = dueDate < new Date();
        const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
        
        return (
          <div className="space-y-2">
            <div className={`${status.bgClass} border rounded-lg p-3`}>
              <div className={`${status.textClass} text-sm font-medium mb-1`}>
                {status.icon} Emprunté par vous
              </div>
              <div className={`text-xs ${isOverdue ? 'text-red-600' : daysLeft <= 7 ? 'text-orange-600' : 'text-gray-600'}`}>
                {isOverdue ? 'Retard! ' : 'À retourner avant le '}
                {dueDate.toLocaleDateString('fr-FR')}
                {!isOverdue && daysLeft <= 7 && (
                  <span className="block mt-1 text-orange-600">
                    Plus que {daysLeft} jour{daysLeft > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {!isOverdue && daysLeft <= 7 && !book.extension_requested && (
                <button
                  onClick={() => onRequestExtension && onRequestExtension(book.reservation_id)}
                  className="mt-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200"
                >
                  � Demander une prolongation
                </button>
              )}
              {book.extension_requested && (
                <div className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  ⏳ Prolongation demandée
                </div>
              )}
            </div>
          </div>
        );
      } else {
        return (
          <div className={`${status.bgClass} border rounded-lg p-3 text-center`}>
            <span className={`${status.textClass} text-sm font-medium`}>
              {status.icon} Livre emprunté
            </span>
          </div>
        );
      }
    }

    if (book.status === 'returned') {
      return (
        <div className={`${status.bgClass} border rounded-lg p-3 text-center`}>
          <span className={`${status.textClass} text-sm font-medium`}>
            {status.icon} {status.text}
          </span>
        </div>
      );
    }

    if (book.status === 'expired') {
      return (
        <div className={`${status.bgClass} border rounded-lg p-3 text-center`}>
          <span className={`${status.textClass} text-sm font-medium`}>
            {status.icon} {status.text}
          </span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-3">
      <div className={`${status.bgClass} border rounded-lg p-3`}>
        <div className={`${status.textClass} font-medium text-sm flex items-center`}>
          <span className="mr-2">{status.icon}</span>
          {status.text}
        </div>
      </div>
      {renderActions()}
    </div>
  );
};

export default BookStatus;