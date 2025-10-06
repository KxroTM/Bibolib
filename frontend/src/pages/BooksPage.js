import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';
import { demoBooks, demoLibraries } from '../services/demoData';
import { getLibraryBackground } from '../utils/libraryBackgrounds';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const BooksPage = () => {
  const query = useQuery();
  const libraryId = query.get('libraryId');

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des livres - si libraryId fourni, filtrer
    setLoading(true);
    try {
      let results = demoBooks;
      if (libraryId) {
        results = demoBooks.filter(b => String(b.libraryId) === String(libraryId));
      }
      setBooks(results);
    } finally {
      setLoading(false);
    }
  }, [libraryId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader size="large" />
        <p className="mt-4 text-gray-600">Chargement des livres...</p>
      </div>
    );
  }

  // find library info if available
  const library = libraryId ? demoLibraries.find(l => String(l.id) === String(libraryId)) : null;
  const background = library ? getLibraryBackground(library.id) : 'https://cdn.paris.fr/paris/2023/08/29/huge-bccf1b019a55e1e21c17371dd1a6482a.jpg';

  return (
    <div className="space-y-8">
      <div 
        className="relative -mt-8 -mx-4 mb-8 py-16 bg-cover bg-center rounded-lg overflow-hidden"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 container mx-auto px-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">
                Livres{library ? ` - ${library.name}` : ''}
              </h1>
              <p className="text-gray-200">
                Liste des livres disponibles{library ? ` dans ${library.name}` : ''}.
              </p>
            </div>
            {library && (
              <Link to={`/bibliotheque/${library.id}`} className="text-white underline">
                Voir la bibliothèque →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div>
        {books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-600">Aucun livre trouvé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map(book => (
              <BookCard key={book.id} book={book} showLibrary={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;
