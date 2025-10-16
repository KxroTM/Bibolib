import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isFavorited, toggleFavorite } from '../utils/favorites';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const BookCard = ({ book, showLibrary = false }) => {
  const [fav, setFav] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setFav(isFavorited(book.id));
    const onUpdate = () => setFav(isFavorited(book.id));
    window.addEventListener('favorites_updated', onUpdate);
    return () => window.removeEventListener('favorites_updated', onUpdate);
  }, [book.id]);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // require login
    if (!user) {
      toast.info('Veuillez vous connecter pour ajouter des favoris');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const res = toggleFavorite(book.id);
    if (res.success) {
      setFav(res.favorited);
      toast.success(res.favorited ? 'Ajouté aux favoris' : 'Retiré des favoris');
    } else {
      if (res.reason === 'limit') toast.error('Limite de favoris atteinte');
      else toast.error('Impossible de modifier les favoris');
    }
  };

  return (
    <Link to={`/livre/${book.id}`}>
      {/* Card layout: fixed height to ensure uniform boxes across grids/carousels */}
      <div className="card overflow-hidden animate-slide-up flex flex-col h-96">
        <div className="relative flex-shrink-0">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-6xl">📖</span>
            </div>
          )}

          {/* Badge de statut */}
          <div className="absolute top-2 right-2 flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              book.status === 'available' 
                ? 'bg-green-500 text-white' 
                : book.status === 'reserved'
                ? 'bg-orange-500 text-white'
                : 'bg-red-500 text-white'
            }`}>
              {book.status === 'available' && '✅ Disponible'}
              {book.status === 'reserved' && '⏳ Réservé'}
              {book.status === 'borrowed' && '📚 Emprunté'}
            </span>
            {/* Favorite heart */}
            <button
              onClick={handleToggle}
              className="p-1 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-red-500 shadow"
              title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <span className="text-lg">{fav ? '♥' : '♡'}</span>
            </button>
          </div>
        </div>

        {/* Content: use flex column and make this area grow to fill card so action footer stays anchored */}
        <div className="p-4 flex flex-col flex-grow overflow-hidden">
          <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
            {book.title}
          </h3>

          <p className="text-gray-600 text-sm mb-2">
            par {book.author}
          </p>

          {book.year && (
            <p className="text-gray-500 text-xs mb-3">
              Publié en {book.year}
            </p>
          )}

          {showLibrary && book.libraryName && (
            <p className="text-primary-600 text-sm font-medium mb-3">
              📍 {book.libraryName}
            </p>
          )}

          {book.description && (
            <p className="text-gray-600 text-sm line-clamp-3 overflow-hidden">
              {book.description}
            </p>
          )}

          {/* Spacer pushes the actions to the bottom */}
          <div className="mt-4 flex items-center justify-between mt-auto">
            {book.genre && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                {book.genre}
              </span>
            )}

            <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              Voir détails →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;