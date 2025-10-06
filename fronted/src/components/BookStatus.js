import React from 'react';
import { useAuth } from '../context/AuthContext';
import ReservationTimer from './ReservationTimer';

const BookStatus = ({ book, onReserve, onCancelReservation, onBorrow, onReturn }) => {
  const { user } = useAuth();
  
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
      case 'reserved':
        const isMyReservation = book.reservedBy === user?.id;
        return {
          color: 'orange',
          icon: '⏳',
          text: isMyReservation ? 'Réservé par vous' : 'Réservé',
          bgClass: isMyReservation ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200',
          textClass: isMyReservation ? 'text-orange-800' : 'text-yellow-800'
        };
      case 'borrowed':
        const isMyBorrow = book.borrowedBy === user?.id;
        return {
          color: 'red',
          icon: '📚',
          text: isMyBorrow ? 'Emprunté par vous' : 'Emprunté',
          bgClass: isMyBorrow ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200',
          textClass: isMyBorrow ? 'text-blue-800' : 'text-red-800'
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
  const isMyReservation = book.status === 'reserved' && book.reservedBy === user?.id;
  const isMyBorrow = book.status === 'borrowed' && book.borrowedBy === user?.id;

  const renderActions = () => {
    if (book.status === 'available') {
      return (
        <div className="space-y-2">
          <button
            onClick={() => onReserve(book.id)}
            className="w-full btn-primary text-sm py-2"
          >
            🔖 Réserver
          </button>
          <button
            onClick={() => onBorrow(book.id)}
            className="w-full btn-secondary text-sm py-2"
          >
            📚 Emprunter directement
          </button>
        </div>
      );
    }

    if (book.status === 'reserved') {
      if (isMyReservation) {
        return (
          <div className="space-y-3">
            <ReservationTimer 
              reservationExpires={book.reservationExpires}
              onCancel={() => onCancelReservation(book.id)}
            />
            <button
              onClick={() => onBorrow(book.id)}
              className="w-full btn-primary text-sm py-2"
            >
              📚 Récupérer le livre
            </button>
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
      if (isMyBorrow) {
        const dueDate = new Date(book.dueDate);
        const isOverdue = dueDate < new Date();
        
        return (
          <div className="space-y-2">
            <div className={`${status.bgClass} border rounded-lg p-3`}>
              <div className={`${status.textClass} text-sm font-medium mb-1`}>
                {status.icon} Emprunté par vous
              </div>
              <div className={`text-xs ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                {isOverdue ? 'Retard! ' : 'À retourner avant le '}
                {dueDate.toLocaleDateString('fr-FR')}
              </div>
            </div>
            <button
              onClick={() => onReturn(book.id)}
              className="w-full btn-secondary text-sm py-2"
            >
              📤 Retourner le livre
            </button>
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