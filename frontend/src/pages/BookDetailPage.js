import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { bookService, adminService, libraryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import BookStatus from '../components/BookStatus';
import { toast } from 'react-toastify';

const BookDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [book, setBook] = useState(null);
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [availableLibraries, setAvailableLibraries] = useState([]);
  const [loadingLibraries, setLoadingLibraries] = useState(false);

  const loadBookData = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await bookService.getById(id);
      // backend renvoie l'objet livre directement (pas { book: ... })
      setBook(response.data || null);
      // library peut ne pas être fournie par l'API
      setLibrary(response.data?.library || null);
      
    } catch (error) {
      console.error('Erreur lors du chargement du livre:', error);
      const serverMsg = error?.response?.data?.message;
      const status = error?.response?.status;
      toast.error(`Erreur lors du chargement du livre${status ? ' ('+status+')' : ''}${serverMsg ? ': '+serverMsg : ''}`);
      
      // Données de démonstration
      const demoBook = {
        id: parseInt(id),
        title: "Le Livre de la Jungle",
        author: "Rudyard Kipling",
        year: 1894,
        isbn: "978-2-07-040832-4",
        genre: "Aventure",
        pages: 256,
        language: "Français",
        publisher: "Gallimard",
        status: "available",
        description: "Les aventures de Mowgli, un petit garçon élevé par les loups dans la jungle indienne. Accompagné de ses amis Baloo l'ours et Bagheera la panthère noire, il apprend les lois de la jungle tout en évitant le terrible tigre Shere Khan qui veut sa perte.",
        coverImage: null,
        downloadLink: null,
        summary: "Un classique de la littérature jeunesse qui nous emmène dans la jungle indienne à la découverte des aventures extraordinaires de Mowgli. Ce livre emblématique explore les thèmes de l'identité, de l'appartenance et de la nature sauvage à travers les yeux d'un enfant unique élevé entre deux mondes.",
        tags: ["Classique", "Aventure", "Jeunesse", "Nature", "Animaux"],
        rating: 4.5,
        borrowCount: 1247,
        reservedBy: null,
        reservedAt: null,
        reservationExpires: null,
        borrowedBy: null,
        borrowedAt: null,
        dueDate: null
      };

      const demoLibrary = {
        id: 1,
        name: "Bibliothèque Forney",
        address: "1 Rue du Figuier, 75004 Paris",
        arrondissement: "4e"
      };

      setBook(demoBook);
      setLibrary(demoLibrary);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadAvailableLibraries = useCallback(async () => {
    try {
      setLoadingLibraries(true);
      
      // Récupérer tous les livres avec le même titre
      const response = await adminService.getBooks({
        limit: 1000 // Récupérer beaucoup de livres pour être sûr d'avoir tous les exemplaires
      });
      
      let allBooks = [];
      const responseData = response.data;
      
      if (responseData && Array.isArray(responseData.books)) {
        allBooks = responseData.books;
      } else if (Array.isArray(responseData)) {
        allBooks = responseData;
      }
      
      // Filtrer les livres avec le même titre (normalisation)
      const currentTitle = book?.title?.toLowerCase().trim();
      const sameBooks = allBooks.filter(b => 
        b.title?.toLowerCase().trim() === currentTitle && 
        b.bibliotheque_id // Avoir une bibliothèque associée
      );
      
      // Récupérer les IDs uniques des bibliothèques
      const libraryIds = [...new Set(sameBooks.map(b => b.bibliotheque_id))];
      
      // Récupérer les détails des bibliothèques
      const librariesResponse = await libraryService.getAll();
      let allLibraries = [];
      
      const librariesData = librariesResponse.data;
      if (librariesData && Array.isArray(librariesData.libraries)) {
        allLibraries = librariesData.libraries;
      } else if (Array.isArray(librariesData)) {
        allLibraries = librariesData;
      }
      
      // Filtrer les bibliothèques qui ont ce livre avec au moins 1 exemplaire disponible
      const availableLibs = allLibraries.filter(lib => 
        libraryIds.includes(lib.id)
      ).map(lib => {
        // Ajouter des informations supplémentaires sur les exemplaires
        const booksInThisLib = sameBooks.filter(b => b.bibliotheque_id === lib.id);
        const availableCount = booksInThisLib.filter(b => b.status === 'available').length;
        const totalCount = booksInThisLib.length;
        
        return {
          ...lib,
          availableCount,
          totalCount,
          books: booksInThisLib
        };
      }).filter(lib => lib.availableCount > 0); // Garder seulement les bibliothèques avec au moins 1 livre disponible
      
      setAvailableLibraries(availableLibs);
      
    } catch (error) {
      console.error('Erreur lors du chargement des bibliothèques:', error);
    } finally {
      setLoadingLibraries(false);
    }
  }, [book]);

  useEffect(() => {
    loadBookData();
  }, [loadBookData]);

  useEffect(() => {
    // Charger les bibliothèques disponibles quand on a les données du livre
    if (book && book.title) {
      loadAvailableLibraries();
    }
  }, [book, loadAvailableLibraries]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleReserve = async (bookId) => {
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
      console.log('Redirection vers login - user:', !!user, 'token:', !!token);
      // redirect to login and come back here after
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      console.log('Tentative de réservation du livre:', bookId);
      const response = await adminService.reserveBook(bookId);
      toast.success(response.data.message || 'Livre pré-réservé avec succès');
      // Recharger les données du livre
      await loadBookData();
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la réservation');
    }
  };

  const handleCancelReservation = async (bookId) => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      const response = await adminService.cancelReservation(bookId);
      toast.success(response.data.message || 'Réservation annulée avec succès');
      // Recharger les données du livre
      await loadBookData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'annulation de la réservation');
    }
  };

  const handleRequestExtension = async (reservationId) => {
    if (!user || !reservationId) return;

    try {
      const response = await adminService.requestExtension(reservationId);
      toast.success(response.data.message || 'Demande de prolongation envoyée');
      // Recharger les données du livre
      await loadBookData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la demande de prolongation');
    }
  };

  // La fonction handleBorrow est supprimée car maintenant on pré-réserve seulement
  // L'emprunt se fait via validation admin

  const handleReturn = async (bookId) => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    // Seuls les admins peuvent marquer les livres comme rendus
    if (!user.permissions?.includes('RESERVATION_MANAGE')) {
      toast.error('Seuls les administrateurs peuvent marquer les livres comme rendus');
      return;
    }

    try {
      const response = await adminService.returnBook(bookId);
      toast.success(response.data.message || 'Livre marqué comme rendu');
      // Recharger les données du livre
      await loadBookData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors du retour');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader size="large" />
        <p className="mt-4 text-gray-600">Chargement du livre...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Livre non trouvé</h2>
        <p className="text-gray-600 mb-4">Le livre demandé n'existe pas ou a été supprimé.</p>
        <Link to="/" className="btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Fil d'Ariane */}
      <nav className="text-sm text-gray-600">
        <Link to="/" className="hover:text-primary-600">Accueil</Link>
        <span className="mx-2">›</span>
        {library && (
          <>
            <Link to={`/bibliotheque/${library.id}`} className="hover:text-primary-600">
              {library.name}
            </Link>
            <span className="mx-2">›</span>
          </>
        )}
        <span>{book.title}</span>
      </nav>

      {/* Détails du livre */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
          {/* Image de couverture */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {book.coverImage && !imageError ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-md"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full max-w-sm mx-auto bg-gray-200 rounded-lg shadow-md flex items-center justify-center aspect-[3/4]">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📖</div>
                    <p className="text-gray-500 text-sm">Couverture non disponible</p>
                  </div>
                </div>
              )}

              {/* Actions et Statut */}
              <div className="mt-6 space-y-4">
                <BookStatus
                  book={book}
                  onReserve={handleReserve}
                  onCancelReservation={handleCancelReservation}
                  onReturn={handleReturn}
                  onRequestExtension={handleRequestExtension}
                />

                {book.downloadLink && (
                  <a
                    href={book.downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-secondary flex items-center justify-center"
                  >
                    📥 Télécharger (PDF)
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Informations du livre */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                par <span className="font-medium">{book.author}</span>
              </p>
              
              {book.rating && (
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(book.rating) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {book.rating}/5 ({book.borrowCount} emprunts)
                  </span>
                </div>
              )}

              {/* Tags */}
              {book.tags && book.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Résumé</h2>
              <p className="text-gray-700 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Résumé détaillé */}
            {book.summary && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">À propos de ce livre</h2>
                <p className="text-gray-700 leading-relaxed">
                  {book.summary}
                </p>
              </div>
            )}

            {/* Informations techniques */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Genre', value: book.genre },
                  { label: 'Année de publication', value: book.year },
                  { label: 'Nombre de pages', value: book.pages },
                  { label: 'Langue', value: book.language },
                  { label: 'Éditeur', value: book.publisher },
                  { label: 'ISBN', value: book.isbn }
                ].map(({ label, value }) => value && (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">{label}</span>
                    <span className="text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Informations de la bibliothèque */}
            {library && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Disponible à la bibliothèque
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-800">{library.name}</p>
                  <p className="text-gray-600 text-sm">📍 {library.address}</p>
                  <p className="text-gray-600 text-sm">🏛️ {library.arrondissement} arrondissement</p>
                </div>
                <Link
                  to={`/bibliotheque/${library.id}`}
                  className="inline-flex items-center mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Voir tous les livres de cette bibliothèque →
                </Link>
              </div>
            )}

            {/* Section des bibliothèques où ce livre est disponible */}
            {availableLibraries.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🏛️</span>
                  Autres bibliothèques avec ce livre disponible ({availableLibraries.length})
                </h3>
                
                {loadingLibraries ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader size="small" />
                    <span className="ml-2 text-gray-600">Recherche en cours...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableLibraries.map((lib) => (
                      <div key={lib.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-800 flex-1">{lib.name}</h4>
                          <div className="text-right ml-3">
                            <div className="text-sm font-medium text-green-600">
                              {lib.availableCount} disponible{lib.availableCount > 1 ? 's' : ''}
                            </div>
                            <div className="text-xs text-gray-500">
                              sur {lib.totalCount} exemplaire{lib.totalCount > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          <p className="flex items-center">
                            <span className="mr-2">📍</span>
                            {lib.adresse}
                          </p>
                          {lib.arrondissement && (
                            <p className="flex items-center">
                              <span className="mr-2">🗺️</span>
                              {lib.arrondissement} arrondissement
                            </p>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Link
                            to={`/bibliotheque/${lib.id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            Voir la bibliothèque →
                          </Link>
                          
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            ✓ Disponible maintenant
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-4 text-xs text-gray-500 text-center">
                  Ces bibliothèques ont des exemplaires disponibles du livre "{book?.title}"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;