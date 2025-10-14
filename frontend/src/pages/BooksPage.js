import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import Loader from '../components/Loader';
import { bookService } from '../services/api';
import { getLibraryBackground } from '../utils/libraryBackgrounds';
import { toast } from 'react-toastify';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const BooksPage = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const libraryId = query.get('libraryId');

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allBooks, setAllBooks] = useState([]); // Pour stocker tous les livres
  const [booksQuery, setBooksQuery] = useState('');
  const itemsPerPage = 20; // 20 livres par page pour une bonne expérience utilisateur

  // Initialiser la recherche depuis l'URL au chargement
  useEffect(() => {
    const searchFromUrl = query.get('search');
    if (searchFromUrl) {
      setBooksQuery(searchFromUrl);
    }
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      
      
      
      // Récupérer TOUS les livres d'abord (sans pagination côté serveur)
      const response = await bookService.getAll({
        page: 1,
        limit: 10000 // Récupérer beaucoup de livres d'un coup
      });
      
      
      
      const responseData = response.data;
      let rawBooks = [];
      
      if (responseData && Array.isArray(responseData.books)) {
        rawBooks = responseData.books;
      } else if (Array.isArray(responseData)) {
        rawBooks = responseData;
      }
      
      
      
      // Dédupliquer les livres par titre (garder le premier de chaque titre)
      const uniqueBooks = [];
      const seenTitles = new Set();
      
      rawBooks.forEach(book => {
        const normalizedTitle = book.title?.toLowerCase().trim();
        if (normalizedTitle && !seenTitles.has(normalizedTitle)) {
          seenTitles.add(normalizedTitle);
          uniqueBooks.push(book);
        }
      });
      
      
      
  // Stocker tous les livres uniques (la pagination et le filtrage
  // se feront côté client dans un useEffect séparé)
  setAllBooks(uniqueBooks);
      
      
      
    } catch (error) {
      
      toast.error('Erreur lors du chargement des livres');
      setBooks([]);
      setAllBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Détecter si on arrive sur la page sans paramètre de page
    const pageFromUrl = query.get('page');
    
    if (!pageFromUrl) {
      // Pas de paramètre page dans l'URL, rediriger vers page 1
      
      navigate('/livres?page=1', { replace: true });
      setCurrentPage(1);
    } else {
      // Il y a un paramètre page dans l'URL
      const pageNumber = parseInt(pageFromUrl) || 1;
      
      setCurrentPage(pageNumber);
    }
  }, [location.pathname, location.search]); // Se déclenche à chaque changement d'URL complet

  // Quand allBooks, currentPage ou booksQuery change, recalculer le filtrage et la pagination
  useEffect(() => {
    if (allBooks.length === 0) {
      loadBooks();
      return;
    }

    const q = booksQuery?.toLowerCase().trim();
    const filtered = q
      ? allBooks.filter(b => {
          return (b.title || '').toLowerCase().includes(q)
            || (b.author || '').toLowerCase().includes(q)
            || (b.genre || '').toLowerCase().includes(q)
            || (b.isbn || '').toLowerCase().includes(q);
        })
      : allBooks;

    const totalItems = filtered.length;
    const totalPagesCalc = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    setTotalPages(totalPagesCalc);

    // Valider currentPage
    const page = Math.min(Math.max(1, currentPage), totalPagesCalc);
    setCurrentPage(page);

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const booksForCurrentPage = filtered.slice(startIndex, endIndex);
    setBooks(booksForCurrentPage);
  }, [allBooks, currentPage, booksQuery]);

  const onBooksSearch = (e) => {
    e && e.preventDefault && e.preventDefault();
    setCurrentPage(1);
    
    // Mettre à jour l'URL avec le paramètre de recherche
    const searchParams = new URLSearchParams();
    searchParams.set('page', '1');
    if (booksQuery.trim()) {
      searchParams.set('search', booksQuery.trim());
    }
    navigate(`/livres?${searchParams.toString()}`, { replace: true });
  };

  const handlePageChange = (page) => {
    // Ne pas mettre à jour si on est déjà sur cette page
    if (page === currentPage) return;
    
    setCurrentPage(page);
    
    // Mettre à jour l'URL en conservant les paramètres de recherche
    const searchParams = new URLSearchParams();
    searchParams.set('page', page.toString());
    if (booksQuery.trim()) {
      searchParams.set('search', booksQuery.trim());
    }
    navigate(`/livres?${searchParams.toString()}`, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader size="large" />
        <p className="mt-4 text-gray-600">Chargement des livres...</p>
      </div>
    );
  }

  // Background par défaut pour tous les livres
  const background = 'https://cdn.paris.fr/paris/2023/08/29/huge-bccf1b019a55e1e21c17371dd1a6482a.jpg';

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
                Tous les Livres
              </h1>
              <p className="text-gray-200">
                Découvrez tous les livres disponibles dans nos bibliothèques (titres uniques).
              </p>
              <p className="text-gray-300 text-sm mt-2">
                {allBooks.length > 0 && `${allBooks.length} livres uniques • Page ${currentPage} sur ${totalPages}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-6">
          <form onSubmit={onBooksSearch} className="flex gap-2">
            <input className="input flex-1" placeholder="Rechercher par titre, auteur, genre ou ISBN..." value={booksQuery} onChange={e=>setBooksQuery(e.target.value)} />
            <button className="btn" type="submit">Rechercher</button>
            <button type="button" className="btn" onClick={()=>{ setBooksQuery(''); setCurrentPage(1); }}>Réinitialiser</button>
          </form>
        </div>
        {books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-600">Aucun livre trouvé.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map(book => (
                <BookCard key={book.id} book={book} showLibrary={true} />
              ))}
            </div>
            
            {/* Pagination améliorée */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center space-y-4 mt-8">
                {/* Informations sur la pagination */}
                <div className="text-sm text-gray-600">
                  Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, allBooks.length)} sur {allBooks.length} livres uniques
                </div>
                
                {/* Contrôles de pagination */}
                <nav className="flex items-center space-x-2">
                  {/* Bouton Première page */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ««
                  </button>
                  
                  {/* Bouton Précédent */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  
                  {/* Numéros de pages */}
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    
                    // Afficher les pages proches de la page actuelle
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === page
                              ? 'text-white bg-blue-600 border border-blue-600'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 3 ||
                      page === currentPage + 3
                    ) {
                      return (
                        <span key={page} className="px-3 py-2 text-sm font-medium text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  
                  {/* Bouton Suivant */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                  
                  {/* Bouton Dernière page */}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    »»
                  </button>
                </nav>
                
                {/* Saut rapide vers une page */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Aller à la page:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        handlePageChange(page);
                      }
                    }}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md text-center"
                  />
                  <span className="text-sm text-gray-600">sur {totalPages}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BooksPage;
