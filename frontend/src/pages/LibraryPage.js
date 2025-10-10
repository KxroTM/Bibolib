import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { libraryService } from '../services/api';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { getLibraryBackground } from '../utils/libraryBackgrounds';

const LibraryPage = () => {
  const { id } = useParams();
  const [library, setLibrary] = useState(null);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [highlightBookId, setHighlightBookId] = useState(null);
  const booksRef = useRef({});
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  // Filtres
  const [selectedGenre, setSelectedGenre] = useState('');
  const [availability, setAvailability] = useState('all');
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    loadLibraryData();
  }, [id, currentPage, selectedGenre, availability]);

  // Read bookId from query string to highlight/scroll to a specific book
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const bookId = qs.get('bookId');
    if (bookId) {
      setHighlightBookId(parseInt(bookId, 10));
    }
  }, [window.location.search]);

  // After books render, scroll to highlighted book
  useEffect(() => {
    if (highlightBookId && booksRef.current[highlightBookId]) {
      booksRef.current[highlightBookId].scrollIntoView({ behavior: 'smooth', block: 'center' });
      // remove highlight after a short delay
      const t = setTimeout(() => setHighlightBookId(null), 4000);
      return () => clearTimeout(t);
    }
  }, [highlightBookId, filteredBooks]);

  const loadLibraryData = async () => {
    try {
      setLoading(true);
      
      // Charger les informations de la bibliothèque
      const libraryResponse = await libraryService.getById(id);
      // Normaliser les champs backend (adresse, telephone) vers ceux attendus côté front
      const rawLib = libraryResponse.data || {};
      const normalizedLibrary = {
        ...rawLib,
        address: rawLib.address || rawLib.adresse || '',
        phone: rawLib.phone || rawLib.telephone || rawLib.telephone_number || '',
      };
      setLibrary(normalizedLibrary);

      // Charger les livres avec filtres
      const booksResponse = await libraryService.getBooks(id, {
        page: currentPage,
        limit: itemsPerPage,
        genre: selectedGenre,
        availability: availability
      });
      
      // Traiter la réponse exactement comme pour les bibliothèques
      const responseData = booksResponse.data;
      let rawBooks = [];
      let totalPagesFromResponse = 1;
      
      if (responseData && Array.isArray(responseData.books)) {
        // Nouveau format avec pagination
        rawBooks = responseData.books;
        totalPagesFromResponse = responseData.totalPages || 1;
      } else if (Array.isArray(responseData)) {
        // Ancien format tableau simple
        rawBooks = responseData;
        totalPagesFromResponse = 1;
      }
      
      setBooks(rawBooks);
      setFilteredBooks(rawBooks);
      setTotalPages(totalPagesFromResponse);

      // Charger les genres disponibles
      const genresResponse = await libraryService.getGenres(id);
      setGenres(genresResponse.data);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement de la bibliothèque');
      
      // Données de démonstration
      const demoLibrary = {
        id: parseInt(id),
        name: `Bibliothèque Paris ${id}`,
        address: `${id} Rue de la Bibliothèque, 75001 Paris`,
        arrondissement: `${id}e`,
        phone: "01 42 78 14 60",
        email: `contact@paris${id}.fr`,
        hours: "Lun-Ven: 10h-19h, Sam: 10h-17h",
        description: "Une magnifique bibliothèque parisienne avec une large collection de livres.",
        isOpen: true,
        bookCount: 1250
      };

      const demoBooks = [
        {
          id: 1,
          title: "Le Livre de la Jungle",
          author: "Rudyard Kipling",
          year: 1894,
          isAvailable: true,
          description: "Les aventures de Mowgli dans la jungle avec ses amis animaux.",
          genre: "Aventure",
          coverImage: null
        },
        {
          id: 2,
          title: "1984",
          author: "George Orwell",
          year: 1949,
          isAvailable: false,
          description: "Un roman dystopique sur la surveillance et le totalitarisme.",
          genre: "Science-Fiction",
          coverImage: null
        },
        {
          id: 3,
          title: "Le Petit Prince",
          author: "Antoine de Saint-Exupéry",
          year: 1943,
          isAvailable: true,
          description: "L'histoire touchante d'un petit prince qui voyage de planète en planète.",
          genre: "Fiction",
          coverImage: null
        }
      ];

      setLibrary(demoLibrary);
      setBooks(demoBooks);
      setFilteredBooks(demoBooks);
      setGenres(['Aventure', 'Science-Fiction', 'Fiction', 'Histoire', 'Biographie']);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      setFilteredBooks(books);
      return;
    }

    try {
      setSearching(true);
      
      const response = await libraryService.searchBooks(id, query);
      
      // Traiter la réponse exactement comme pour les bibliothèques
      const responseData = response.data;
      let searchResults = [];
      
      if (responseData && Array.isArray(responseData.books)) {
        // Nouveau format avec pagination
        searchResults = responseData.books;
      } else if (Array.isArray(responseData)) {
        // Ancien format tableau simple
        searchResults = responseData;
      }
      
      setFilteredBooks(searchResults);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      // Recherche locale en cas d'erreur
      const filtered = books.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(filtered);
    } finally {
      setSearching(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader size="large" />
        <p className="mt-4 text-gray-600">Chargement de la bibliothèque...</p>
      </div>
    );
  }

  if (!library) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Bibliothèque non trouvée</h2>
        <p className="text-gray-600 mb-4">La bibliothèque demandée n'existe pas ou a été supprimée.</p>
        <Link to="/" className="btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Section Hero avec image d'arrière-plan */}
      <div 
        className="relative -mt-8 -mx-4 mb-8 py-16 bg-cover bg-center"
        style={{
          backgroundImage: `url(${getLibraryBackground(library.id)})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 container mx-auto px-4">
          {/* Fil d'Ariane */}
          <nav className="text-sm text-white mb-6">
            <Link to="/" className="hover:text-blue-200">Accueil</Link>
            <span className="mx-2">›</span>
            <span className="text-blue-200">{library.name}</span>
          </nav>
          
          <div className="text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
                  {library.name}
                </h1>
                <p className="text-xl drop-shadow-lg">{library.arrondissement} arrondissement</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                library.isOpen 
                  ? 'bg-green-500 bg-opacity-90 text-white' 
                  : 'bg-red-500 bg-opacity-90 text-white'
              }`}>
                {library.isOpen ? 'Ouvert' : 'Fermé'}
              </span>
            </div>
            <p className="text-lg drop-shadow-lg max-w-2xl">
              {library.description}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
      {/* Informations détaillées de la bibliothèque */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations pratiques</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">📍 Adresse</h3>
                <p className="text-gray-600">{library.address}</p>
              </div>
              
              {library.phone && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">📞 Téléphone</h3>
                  <p className="text-gray-600">{library.phone}</p>
                </div>
              )}
              
              {library.email && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">✉️ Email</h3>
                  <p className="text-gray-600">{library.email}</p>
                </div>
              )}
              
              {library.hours && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">🕒 Horaires</h3>
                  <p className="text-gray-600">{library.hours}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Statistiques</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total des livres</span>
                <span className="font-medium">{library.bookCount || books.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Disponibles</span>
                <span className="font-medium text-green-600">
                  {books.filter(b => b.isAvailable).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Empruntés</span>
                <span className="font-medium text-red-600">
                  {books.filter(b => !b.isAvailable).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Rechercher dans cette bibliothèque..."
            className="w-full"
          />
          
          <div className="flex flex-wrap gap-4">
            {/* Filtre par genre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="input-field w-auto"
              >
                <option value="">Tous les genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Filtre par disponibilité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="input-field w-auto"
              >
                <option value="all">Tous</option>
                <option value="available">Disponibles</option>
                <option value="borrowed">Empruntés</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des livres */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Collection de livres
          </h2>
          <p className="text-gray-600">
            {(filteredBooks || []).length} livre{(filteredBooks || []).length > 1 ? 's' : ''}
          </p>
        </div>

        {searching ? (
          <div className="text-center py-12">
            <Loader size="large" />
            <p className="mt-4 text-gray-600">Recherche en cours...</p>
          </div>
  ) : (filteredBooks || []).length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  ref={(el) => { if (el) booksRef.current[book.id] = el; }}
                  className={book.id === highlightBookId ? 'ring-2 ring-primary-300 rounded' : ''}
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-600">Aucun livre trouvé.</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default LibraryPage;