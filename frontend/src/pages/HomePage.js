import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { bookService, adminService } from '../services/api';
import { demoBooks } from '../services/demoData';
import Loader from '../components/Loader';
import BookCarousel from '../components/BookCarousel';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import { getLibraryBackground } from '../utils/libraryBackgrounds';
import NewBooksCarousel from '../components/NewBooksCarousel';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [newBooks, setNewBooks] = useState([]);
  const [bestRatedBooks, setBestRatedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadBooksData();
  }, []);



  const loadBooksData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les livres depuis l'endpoint public (pas besoin d'auth)
      const response = await bookService.getAll({
        page: 1,
        limit: 1000 // Récupérer TOUS les livres pour pouvoir dédupliquer correctement
      });
      
      const responseData = response.data;
      let books = [];
      
      if (responseData && Array.isArray(responseData.books)) {
        books = responseData.books;
      } else if (Array.isArray(responseData)) {
        books = responseData;
      }

      if (books.length > 0) {
        // Fonction pour dédupliquer les livres basés sur titre + auteur + éditeur
        const deduplicateBooks = (booksList) => {
          const seen = new Set();
          return booksList.filter(book => {
            // Créer une clé unique basée sur titre + auteur + éditeur
            const key = `${book.title?.toLowerCase() || ''}-${book.author?.toLowerCase() || ''}-${book.publisher?.toLowerCase() || ''}`;
            if (seen.has(key)) {
              return false;
            }
            seen.add(key);
            return true;
          });
        };

        // Nouveaux livres - avec déduplication et filtre sur l'année
        const booksWithYear = books.filter(book => book.year && book.year !== null);
        
        const recentBooksBeforeDedup = [...booksWithYear]
          .sort((a, b) => {
            const yearA = parseInt(a.year) || 0;
            const yearB = parseInt(b.year) || 0;
            return yearB - yearA; // Plus récent d'abord
          });
        
        // Appliquer la déduplication SEULEMENT aux nouveautés
        const recentBooksDedup = deduplicateBooks(recentBooksBeforeDedup);
        
        setNewBooks(recentBooksDedup.slice(0, 8));

        // Livres "les mieux notés" - sélection aléatoire SANS déduplication
        const shuffled = [...books].sort(() => 0.5 - Math.random());
        setBestRatedBooks(shuffled.slice(0, 8));
      } else {
        // Fallback sur les données de démonstration si aucun livre en DB
        const demoRecentBooks = demoBooks
          .filter(book => book.isNew || book.addedAt)
          .sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0))
          .slice(0, 8);
        setNewBooks(demoRecentBooks);

        const demoTopRated = [...demoBooks]
          .filter(book => book.rating)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 8);
        setBestRatedBooks(demoTopRated);
      }
      
    } catch (error) {
      toast.error('Erreur lors du chargement des livres');
      
      // Fallback sur les données de démonstration en cas d'erreur
      const books = demoBooks;
      const recentBooks = books
        .filter(book => book.isNew || book.addedAt)
        .sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0))
        .slice(0, 8);
      setNewBooks(recentBooks);

      const topRated = [...books]
        .filter(book => book.rating)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
      setBestRatedBooks(topRated);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(async (query) => {
    if (!query) {
      setSearchResults([]);
      setSearchQuery('');
      return;
    }

    try {
      setSearching(true);
      setSearchQuery(query);

      // Utiliser l'API de recherche de livres
      const response = await bookService.search(query);
      const results = response.data || [];
      
      setSearchResults(results);
      
    } catch (error) {
      toast.error('Erreur lors de la recherche');
      
      // Fallback sur les données de démonstration en cas d'erreur
      const results = demoBooks.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        (book.author || '').toLowerCase().includes(query.toLowerCase()) ||
        (book.genre || '').toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      toast.error('Erreur lors de la recherche');
    } finally {
      setSearching(false);
    }
  }, []);



  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader size="large" />
        <p className="mt-4 text-gray-600">Chargement de la bibliothèque...</p>
      </div>
    );
  }

  return (
    <>
      {/* Section Hero avec image d'arrière-plan */}
      <div 
        className="relative -mt-8 -mx-4 mb-8 py-20 md:py-28 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://www.pariszigzag.fr/wp-content/uploads/2021/12/Site-Richelieu.jpg)',
          minHeight: '420px'
        }}
      >
        <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 drop-shadow-lg">
            Bibliothèque numérique Paris
          </h1>
          <p className="text-xl md:text-2xl mb-4 drop-shadow-lg">
            Découvrez les livres des bibliothèques parisiennes
          </p>
          <div className="max-w-xl mx-auto mb-4">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Rechercher un livre (ex: Le Petit Prince)..."
              className="w-full"
            />
            {/* Résultats de recherche: afficher bibliothèques contenant le livre */}
            {searchResults && searchResults.length > 0 && (
              <div className="mt-2 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
                {searchResults.map((b) => (
                  <Link
                    key={`${b.libraryId}-${b.id}`}
                    to={`/bibliotheque/${b.libraryId}?bookId=${b.id}`}
                    className="block px-4 py-3 text-black hover:bg-gray-100 border-b last:border-b-0"
                  >
                    {b.libraryName} - {b.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link 
            to="/libraries" 
            className="inline-flex items-center px-5 py-2 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white font-medium rounded-lg hover:bg-opacity-30 transition-all duration-200"
          >
            📚 Voir toutes les bibliothèques
          </Link>
        </div>
      </div>

      <div className="space-y-12">

        {/* Nouveaux livres - Single-item carousel */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🆕 Nouveaux livres</h2>
          <NewBooksCarousel books={newBooks} autoInterval={4500} />
        </section>

        {/* Livres les mieux notés */}
        <section>
          <BookCarousel
            books={bestRatedBooks}
            title="⭐ Livres les mieux notés"
            subtitle="Les coups de cœur de nos lecteurs"
            speed={30} /* pixels per second, adjust for faster/slower */
          />
        </section>

      </div>
    </>
  );
};

export default HomePage;
