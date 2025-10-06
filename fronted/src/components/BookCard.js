import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book, showLibrary = false }) => {
  return (
    <Link to={`/book/${book.id}`}>
      <div className="card overflow-hidden animate-slide-up">
        <div className="relative">
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
          <div className="absolute top-2 right-2">
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
          </div>
        </div>

        <div className="p-4">
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
            <p className="text-gray-600 text-sm line-clamp-3">
              {book.description}
            </p>
          )}
          
          <div className="mt-4 flex items-center justify-between">
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