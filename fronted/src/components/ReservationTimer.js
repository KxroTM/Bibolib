import React, { useState, useEffect } from 'react';

const ReservationTimer = ({ reservationExpires, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!reservationExpires) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(reservationExpires).getTime();
      const difference = expiry - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft(null);
        setIsExpired(true);
      }
    };

    // Mise à jour immédiate
    updateTimer();
    
    // Mise à jour toutes les secondes
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [reservationExpires]);

  const formatTimeLeft = () => {
    if (!timeLeft) return '';
    
    if (timeLeft.days > 0) {
      return `${timeLeft.days}j ${timeLeft.hours}h ${timeLeft.minutes}m`;
    } else if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
    } else {
      return `${timeLeft.minutes}m ${timeLeft.seconds}s`;
    }
  };

  if (isExpired) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-red-600 text-sm font-medium">⏰ Réservation expirée</span>
        </div>
      </div>
    );
  }

  if (!timeLeft) {
    return null;
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-orange-800 font-medium text-sm">Réservé pour vous</div>
          <div className="text-orange-600 text-sm">
            Temps restant: <span className="font-mono font-bold">{formatTimeLeft()}</span>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="px-3 py-1 text-xs text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-md transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default ReservationTimer;