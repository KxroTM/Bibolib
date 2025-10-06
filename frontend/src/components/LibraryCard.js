import React from 'react';
import { Link } from 'react-router-dom';
import { getLibraryBackground } from '../utils/libraryBackgrounds';

const LibraryCard = ({ library }) => {
  return (
    <div className="card animate-fade-in overflow-hidden">
        {/* Image d'arrière-plan */}
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${getLibraryBackground(library.id)})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 text-xs rounded-full ${
              library.isOpen 
                ? 'bg-green-500 bg-opacity-90 text-white' 
                : 'bg-red-500 bg-opacity-90 text-white'
            }`}>
              {library.isOpen ? 'Ouvert' : 'Fermé'}
            </span>
          </div>
            <div className="absolute bottom-4 left-4 text-white">
              <Link to={`/bibliotheque/${library.id}`} className="block">
                <h3 className="text-xl font-semibold drop-shadow-lg">
                  {library.name}
                </h3>
                <span className="text-sm drop-shadow-lg">
                  {library.arrondissement}
                </span>
              </Link>
            </div>
        </div>
        
        {/* Contenu de la carte */}
        <div className="p-6">
          <div className="space-y-2">
            <p className="text-gray-600 text-sm">
              📍 {library.address}
            </p>
            <p className="text-gray-600 text-sm">
              📚 {library.bookCount || 0} livres disponibles
            </p>
            {library.phone && (
              <p className="text-gray-600 text-sm">
                📞 {library.phone}
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Link to={`/bibliotheque/${library.id}`} className="text-sm text-gray-600 hover:text-gray-800">Voir la bibliothèque</Link>
            <Link
              to={`/bibliotheque/${library.id}`}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Voir la bibliothèque →
            </Link>
          </div>
        </div>
      </div>
  );
};

export default LibraryCard;