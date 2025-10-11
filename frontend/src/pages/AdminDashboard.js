import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/api';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import { PermissionGuard } from '../components/PermissionGuard';
import { usePermissions } from '../hooks/usePermissions';

// Composant Modal réutilisable
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookQuery, setBookQuery] = useState('');
  const [libraryQuery, setLibraryQuery] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 1000; // Limite très élevée pour afficher tous les livres

  const readOnly = false;

  // Formulaire livre
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    published_at: '',
    genre: '',
    isbn: '',
    pages: '',
    language: 'Français',
    publisher: '',
    description: '',
    summary: '',
    coverImage: '',
    downloadLink: '',
    libraryId: ''
  });

  // Edition en cours
  const [editingBookId, setEditingBookId] = useState(null);

  // Formulaire bibliothèque
  const [libraryForm, setLibraryForm] = useState({
    name: '',
    address: '',
    arrondissement: '',
    phone: '',
    email: '',
    hours: '',
    description: '',
    website: ''
  });

  // Edition bibliothèque
  const [editingLibraryId, setEditingLibraryId] = useState(null);

  // Formulaire admin
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin'
  });

  // État pour l'édition des rôles utilisateurs
  const [editingUserId, setEditingUserId] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [userRoles, setUserRoles] = useState({}); // Cache des rôles par utilisateur

  // États de visibilité des modales de création
  const [showBookModal, setShowBookModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    loadData();
    loadAvailableRoles(); // Charger les rôles au démarrage
  }, [activeTab, currentPage]);

  const loadAvailableRoles = async () => {
    try {
      const response = await adminService.getRoles();
      setAvailableRoles(response.data || []);
    } catch (error) {
      // Fallback vers des rôles par défaut en cas d'erreur
      setAvailableRoles([
        { id: 1, name: 'user', description: 'Utilisateur standard' },
        { id: 2, name: 'admin', description: 'Administrateur' }
      ]);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'books':
          await loadBooks();
          break;
        case 'libraries':
          await loadLibraries();
          break;
        case 'admins':
          await loadAdmins();
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const loadBooks = async () => {
    try {
      const params = { page: currentPage, limit: itemsPerPage };
      if (bookQuery) params.q = bookQuery;
      const response = await adminService.getBooks(params);
      
      // Traiter la réponse exactement comme pour les bibliothèques
      const responseData = response.data;
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
      setTotalPages(totalPagesFromResponse);
    } catch (error) {
      
      toast.error('Erreur lors du chargement des livres');
    }
  };

  const loadLibraries = async () => {
    try {
      const params = { page: currentPage, limit: itemsPerPage };
      if (libraryQuery) params.q = libraryQuery;
      const response = await adminService.getLibraries(params);
      
      const responseData = response.data;
      let rawLibraries = [];
      let totalPagesFromResponse = 1;
      
      if (responseData && Array.isArray(responseData.libraries)) {
        // Nouveau format avec pagination
        rawLibraries = responseData.libraries;
        totalPagesFromResponse = responseData.totalPages || 1;
      } else if (Array.isArray(responseData)) {
        // Ancien format tableau simple
        rawLibraries = responseData;
        totalPagesFromResponse = 1;
      }
      
      setLibraries(rawLibraries);
      if (activeTab === 'libraries') {
        setTotalPages(totalPagesFromResponse);
      }
    } catch (error) {
      
      toast.error('Erreur lors du chargement des bibliothèques');
    }
  };

  const onBookSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadBooks();
  };

  const onLibrarySearch = (e) => {
    e.preventDefault();
    loadLibraries();
  };

  const onUserSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadAdmins();
  };

  const onRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
    // Déclencher le chargement immédiatement lors du changement de filtre
    setTimeout(() => loadAdmins(), 100);
  };

  const loadAdmins = async () => {
    try {
      const params = { page: currentPage, limit: itemsPerPage };
      if (userQuery) params.q = userQuery;
      if (roleFilter) params.role = roleFilter;
      const response = await adminService.getUsers(params);
      
      // Traiter la réponse selon le nouveau format avec pagination
      const responseData = response.data;
      let rawUsers = [];
      let totalPagesFromResponse = 1;
      
      if (responseData && Array.isArray(responseData.users)) {
        // Nouveau format avec pagination
        rawUsers = responseData.users;
        totalPagesFromResponse = responseData.totalPages || 1;
      } else if (Array.isArray(responseData)) {
        // Ancien format tableau simple
        rawUsers = responseData;
        totalPagesFromResponse = 1;
      }
      
      setAdmins(rawUsers);
      if (activeTab === 'admins') {
        setTotalPages(totalPagesFromResponse);
      }
    } catch (error) {
      
      toast.error('Erreur lors du chargement des utilisateurs');
    }
  };

  const resetBookForm = () => {
    setBookForm({
      title: '', author: '', published_at: '', genre: '', isbn: '', pages: '', language: 'Français', publisher: '', description: '', summary: '', coverImage: '', downloadLink: '', libraryId: ''
    });
    setShowBookModal(false);
    setEditingBookId(null);
  };
  
  const resetLibraryForm = () => {
    setLibraryForm({ name: '', address: '', arrondissement: '', phone: '', email: '', hours: '', description: '', website: '' });
    setShowLibraryModal(false);
  };
  
  const resetAdminForm = () => {
    setAdminForm({ name: '', email: '', password: '', role: 'admin' });
    setShowUserModal(false);
  };

  // Fonction pour ouvrir le modal de création de livre
  const openBookModal = async () => {
    // S'assurer que les bibliothèques sont chargées
    if (libraries.length === 0) {
      await loadLibraries();
    }
    setShowBookModal(true);
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!bookForm.title || !bookForm.author || !bookForm.libraryId) return toast.error('Champs requis manquants');
    try {
      if (editingBookId) {
        await adminService.updateBook(editingBookId, {
          title: bookForm.title,
          author: bookForm.author,
          bibliotheque_id: parseInt(bookForm.libraryId,10),
          published_at: bookForm.published_at || null,
          genre: bookForm.genre || null,
          isbn: bookForm.isbn || null,
          pages: bookForm.pages ? parseInt(bookForm.pages,10) : null,
          language: bookForm.language || null,
          publisher: bookForm.publisher || null,
          description: bookForm.description || null,
          summary: bookForm.summary || null,
          coverImage: bookForm.coverImage || null,
          downloadLink: bookForm.downloadLink || null
        });
        toast.success('Livre mis à jour');
        setEditingBookId(null);
        resetBookForm();
        loadBooks();
      } else {
        await adminService.createBook({
          title: bookForm.title,
          author: bookForm.author,
          bibliotheque_id: parseInt(bookForm.libraryId,10),
          published_at: bookForm.published_at || null,
          genre: bookForm.genre || null,
          isbn: bookForm.isbn || null,
          pages: bookForm.pages ? parseInt(bookForm.pages,10) : null,
          language: bookForm.language || null,
          publisher: bookForm.publisher || null,
          description: bookForm.description || null,
          summary: bookForm.summary || null,
          coverImage: bookForm.coverImage || null,
          downloadLink: bookForm.downloadLink || null
        });
        toast.success('Livre créé');
        resetBookForm();
        loadBooks();
      }
    } catch(err){  toast.error('Création livre échouée'); }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Supprimer ce livre ?')) return;
    try { await adminService.deleteBook(id); toast.info('Livre supprimé'); loadBooks(); } catch (e) {  toast.error('Suppression échouée'); }
  };

  const startEditBook = async (book) => {
    // S'assurer que les bibliothèques sont chargées
    if (libraries.length === 0) {
      await loadLibraries();
    }
    setEditingBookId(book.id);
    setBookForm({
      title: book.title || '',
      author: book.author || '',
      published_at: book.published_at || book.year || '',
      genre: book.genre || '',
      isbn: book.isbn || '',
      pages: book.pages ? String(book.pages) : '',
      language: book.language || 'Français',
      publisher: book.publisher || '',
      description: book.description || '',
      summary: book.summary || '',
      coverImage: book.coverImage || '',
      downloadLink: book.downloadLink || '',
      libraryId: book.bibliotheque_id || book.libraryId || ''
    });
    setShowBookModal(true);
  };

  const cancelEditBook = () => {
    setEditingBookId(null);
    resetBookForm();
  };

  const handleLibrarySubmit = async (e) => {
    e.preventDefault();
    if (!libraryForm.name || !libraryForm.address) return toast.error('Nom & adresse requis');
    try {
      if (editingLibraryId) {
        await adminService.updateLibrary(editingLibraryId, { name: libraryForm.name, adresse: libraryForm.address, arrondissement: libraryForm.arrondissement || null, telephone: libraryForm.phone || null, email: libraryForm.email || null });
        toast.success('Bibliothèque mise à jour');
        setEditingLibraryId(null);
        resetLibraryForm();
        loadLibraries();
      } else {
        await adminService.createLibrary({ name: libraryForm.name, adresse: libraryForm.address, arrondissement: libraryForm.arrondissement || null, telephone: libraryForm.phone || null, email: libraryForm.email || null });
        toast.success('Bibliothèque créée');
        resetLibraryForm();
        loadLibraries();
      }
    } catch (e) {  toast.error('Création bibliothèque échouée'); }
  };

  const handleDeleteLibrary = async (id) => {
    if (!window.confirm('Supprimer cette bibliothèque ?')) return;
    try { await adminService.deleteLibrary(id); toast.info('Bibliothèque supprimée'); loadLibraries(); } catch (e) {  toast.error('Suppression échouée'); }
  };

  const startEditLibrary = (lib) => {
    setEditingLibraryId(lib.id);
    setLibraryForm({
      name: lib.name || '',
      address: lib.adresse || lib.address || '',
      arrondissement: lib.arrondissement || '',
      phone: lib.telephone || '',
      email: lib.email || '',
      hours: lib.hours || '',
      description: lib.description || '',
      website: lib.website || ''
    });
    setShowLibraryModal(true);
  };

  const cancelEditLibrary = () => {
    setEditingLibraryId(null);
    resetLibraryForm();
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.email || !adminForm.password) return toast.error('Champs requis');
    try {
      await adminService.createUser({ username: adminForm.name, email: adminForm.email, password: adminForm.password });
      toast.success('Utilisateur créé');
      resetAdminForm();
      loadAdmins();
    } catch(e){  toast.error('Création utilisateur échouée'); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Supprimer utilisateur ?')) return;
    try { await adminService.deleteUser(id); toast.info('Utilisateur supprimé'); loadAdmins(); } catch(e){  toast.error('Suppression échouée'); }
  };

  // Fonctions de gestion des rôles
  const handleRoleChange = async (userId, roleId, action) => {
    try {
      if (action === 'add') {
        await adminService.assignRoleToUser(userId, roleId);
        toast.success('Rôle assigné');
      } else {
        await adminService.removeRoleFromUser(userId, roleId);
        toast.success('Rôle retiré');
      }
      // Recharger les données pour avoir les rôles à jour
      await loadAdmins();
      
      // Mettre à jour selectedUser avec les nouvelles données
      if (selectedUser) {
        const updatedUser = admins.find(u => u.id === selectedUser.id);
        if (updatedUser) {
          setSelectedUser(updatedUser);
        }
      }
    } catch (error) {
      
      toast.error('Erreur lors de la modification du rôle');
    }
  };

  const startEditUserRoles = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const cancelEditUserRoles = () => {
    setEditingUserId(null);
    setShowRoleModal(false);
    setSelectedUser(null);
  };

  // Charger les rôles disponibles au démarrage
  useEffect(() => {
    loadAvailableRoles();
  }, []);

  // Fonctions de modale retirées (lecture seule)

  const tabs = [
    { id: 'books', label: '📚 Livres', count: books.length },
    { id: 'libraries', label: '🏛️ Bibliothèques', count: libraries.length },
    { id: 'admins', label: '👥 Utilisateurs', count: admins.length }
  ];

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Panneau d'Administration
            </h1>
            <p className="text-gray-600">
              Gérez les livres, bibliothèques et administrateurs de BiboLib
            </p>
          </div>
          <div>
            <Link to="/admin/logs" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h3V6a1 1 0 112 0v4h3a1 1 0 110 2H8v4a1 1 0 11-2 0v-4H3a1 1 0 01-1-1z"/></svg>
              Voir les logs
            </Link>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Livres</p>
              <p className="text-2xl font-semibold text-gray-900">{books.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🏛️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bibliothèques</p>
              <p className="text-2xl font-semibold text-gray-900">{libraries.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Administrateurs</p>
              <p className="text-2xl font-semibold text-gray-900">{admins.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'books' && 'Livres'}
              {activeTab === 'libraries' && 'Bibliothèques'}
              {activeTab === 'admins' && 'Utilisateurs'}
            </h2>
            
            {readOnly ? (
              <span className="text-xs uppercase tracking-wide text-gray-400">Lecture seule</span>
            ) : (
              <span className="text-xs uppercase tracking-wide text-green-600">Mode édition</span>
            )}
          </div>

          {/* Contenu */}
          {loading ? (
            <div className="text-center py-12">
              <Loader size="large" />
            </div>
          ) : (
            <>
              {/* Table des livres */}
              {activeTab === 'books' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <form onSubmit={onBookSearch} className="flex items-center gap-2 mb-4">
                      <input className="input" placeholder="Rechercher un livre..." value={bookQuery} onChange={e=>setBookQuery(e.target.value)} />
                      <button className="btn" type="submit">Rechercher</button>
                      <button type="button" className="btn" onClick={()=>{ setBookQuery(''); setCurrentPage(1); loadBooks(); }}>Réinitialiser</button>
                    </form>
                    <button 
                      className="btn btn-primary"
                      onClick={openBookModal}
                    >
                      Créer un livre
                    </button>
                  </div>

                  {/* Liste des livres */}
                  <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Livre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Auteur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Année
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Genre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bibliothèque
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {books.map((book) => (
                        <tr key={book.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{book.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {book.author}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {book.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {book.genre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              (book.status === 'available')
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {book.status === 'available' ? 'Disponible' : 'Emprunté'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {book.bibliotheque_nom || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {!readOnly && (
                              <div className="flex items-center gap-3">
                                <button className="text-blue-600 hover:underline text-xs" onClick={()=>startEditBook(book)}>Modifier</button>
                                <button className="text-red-600 hover:underline text-xs" onClick={()=>handleDeleteBook(book.id)}>Supprimer</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              )}

              {/* Table des bibliothèques */}
              {activeTab === 'libraries' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <form onSubmit={onLibrarySearch} className="flex items-center gap-2 mb-4">
                      <input className="input" placeholder="Rechercher une bibliothèque..." value={libraryQuery} onChange={e=>setLibraryQuery(e.target.value)} />
                      <button className="btn" type="submit">Rechercher</button>
                      <button type="button" className="btn" onClick={()=>{ setLibraryQuery(''); loadLibraries(); }}>Réinitialiser</button>
                    </form>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowLibraryModal(true)}
                    >
                      Créer une bibliothèque
                    </button>
                  </div>

                  {/* Liste des bibliothèques */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {libraries.map((library) => (
                      <div key={library.id} className="card p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {library.name}
                          </h3>
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-600">📍 {library.adresse || library.address}</p>
                          <p className="text-sm text-gray-600">🏛️ {library.arrondissement || '—'} arrondissement</p>
                          {library.email && <p className="text-sm text-gray-600">✉️ {library.email}</p>}
                          {library.telephone && <p className="text-sm text-gray-600">📞 {library.telephone}</p>}
                        </div>
                        <div className="flex space-x-2 text-xs">
                          {!readOnly && (
                            <div className="flex items-center gap-3">
                              <button className="text-blue-600 hover:underline" onClick={()=>startEditLibrary(library)}>Modifier</button>
                              <button className="text-red-600 hover:underline" onClick={()=>handleDeleteLibrary(library.id)}>Supprimer</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Table des administrateurs */}
              {activeTab === 'admins' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <form onSubmit={onUserSearch} className="flex items-center gap-2">
                        <input className="input" placeholder="Rechercher un utilisateur..." value={userQuery} onChange={e=>setUserQuery(e.target.value)} />
                        <button className="btn" type="submit">Rechercher</button>
                      </form>
                      <select className="input" value={roleFilter} onChange={onRoleFilterChange}>
                        <option value="">Tous les rôles</option>
                        {availableRoles.map(role => (
                          <option key={role.id} value={role.name}>
                            {role.description || role.name}
                          </option>
                        ))}
                      </select>
                      <button type="button" className="btn" onClick={()=>{ setUserQuery(''); setRoleFilter(''); setCurrentPage(1); loadAdmins(); }}>Réinitialiser tout</button>
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowUserModal(true)}
                    >
                      Créer un utilisateur
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date de création
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {admins.map((admin) => (
                        <tr key={admin.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary-800">
                                    {(admin.username || admin.name || admin.email || '?').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{admin.username || admin.name || admin.email}</div>
                                <div className="text-sm text-gray-500">ID: {admin.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {admin.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {admin.roles && admin.roles.length > 0 ? (
                                admin.roles.map((role, index) => (
                                  <span key={role.id || role.name || index} className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                    role.name === 'admin' 
                                      ? 'bg-red-100 text-red-800'
                                      : role.name === 'manager'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : role.name === 'librarian'
                                      ? 'bg-green-100 text-green-800'
                                      : role.name === 'user'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {role.name || role}
                                  </span>
                                ))
                              ) : (
                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                                  Aucun rôle
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Actif
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {admin.created_at ? new Date(admin.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              {!readOnly && (
                                <>
                                  <button
                                    onClick={() => startEditUserRoles(admin)}
                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                  >
                                    🔧 Rôles
                                  </button>
                                  <button 
                                    className="text-red-600 hover:text-red-800 text-xs font-medium" 
                                    onClick={()=>handleDeleteUser(admin.id)}
                                  >
                                    🗑️ Supprimer
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {activeTab === 'books' && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Modales supprimées */}

      {/* Modal d'édition des rôles */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Gérer les rôles - {selectedUser.username || selectedUser.name || selectedUser.email}
              </h3>
              
              <div className="space-y-3 mb-6">
                {availableRoles.map(role => {
                  // Les rôles de l'utilisateur peuvent être des strings ou des objets
                  const hasRole = selectedUser.roles && selectedUser.roles.some(r => 
                    (typeof r === 'string' && r === role.name) || 
                    (typeof r === 'object' && (r.id === role.id || r.name === role.name))
                  );
                  return (
                    <div key={role.id || role.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={hasRole}
                          onChange={(e) => handleRoleChange(selectedUser.id, role.id || role.name, e.target.checked ? 'add' : 'remove')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{role.name}</div>
                          <div className="text-xs text-gray-500">{role.description || 'Aucune description'}</div>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        hasRole 
                          ? role.name === 'admin' 
                            ? 'bg-red-100 text-red-800'
                            : role.name === 'manager'
                            ? 'bg-yellow-100 text-yellow-800'
                            : role.name === 'librarian'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {hasRole ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelEditUserRoles}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals pour créer des éléments */}
      {/* Modal pour créer/éditer un livre */}
      <Modal isOpen={showBookModal} title={editingBookId ? "Modifier le livre" : "Créer un nouveau livre"} onClose={() => setShowBookModal(false)}>
        <form onSubmit={handleBookSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" placeholder="Titre *" value={bookForm.title} onChange={e=>setBookForm({...bookForm,title:e.target.value})} />
            <input className="input" placeholder="Auteur *" value={bookForm.author} onChange={e=>setBookForm({...bookForm,author:e.target.value})} />
            <input className="input" placeholder="ISBN" value={bookForm.isbn} onChange={e=>setBookForm({...bookForm,isbn:e.target.value})} />
            <input className="input" placeholder="Genre" value={bookForm.genre} onChange={e=>setBookForm({...bookForm,genre:e.target.value})} />
            <input className="input" type="url" placeholder="URL de l'image" value={bookForm.coverImage} onChange={e=>setBookForm({...bookForm,coverImage:e.target.value})} />
            <select className="input" value={bookForm.libraryId} onChange={e=>setBookForm({...bookForm,libraryId:e.target.value})}>
              <option value="">Sélectionner une bibliothèque *</option>
              {libraries.map(lib => (
                <option key={lib.id} value={lib.id}>{lib.name}</option>
              ))}
            </select>
          </div>
          <textarea className="input w-full h-24" placeholder="Description" value={bookForm.description} onChange={e=>setBookForm({...bookForm,description:e.target.value})} />
          <div className="flex justify-end gap-2">
            <button type="button" className="btn" onClick={() => setShowBookModal(false)}>Annuler</button>
            <button className="btn btn-primary" type="submit">{editingBookId ? "Enregistrer" : "Créer le livre"}</button>
          </div>
        </form>
      </Modal>

      {/* Modal pour créer/éditer une bibliothèque */}
      <Modal isOpen={showLibraryModal} title={editingLibraryId ? "Modifier la bibliothèque" : "Créer une nouvelle bibliothèque"} onClose={() => setShowLibraryModal(false)}>
        <form onSubmit={handleLibrarySubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" placeholder="Nom *" value={libraryForm.name} onChange={e=>setLibraryForm({...libraryForm,name:e.target.value})} />
            <input className="input" placeholder="Adresse *" value={libraryForm.address} onChange={e=>setLibraryForm({...libraryForm,address:e.target.value})} />
            <input className="input" placeholder="Arrondissement" value={libraryForm.arrondissement} onChange={e=>setLibraryForm({...libraryForm,arrondissement:e.target.value})} />
            <input className="input" placeholder="Email" value={libraryForm.email} onChange={e=>setLibraryForm({...libraryForm,email:e.target.value})} />
            <input className="input" placeholder="Téléphone" value={libraryForm.phone} onChange={e=>setLibraryForm({...libraryForm,phone:e.target.value})} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn" onClick={() => setShowLibraryModal(false)}>Annuler</button>
            <button className="btn btn-primary" type="submit">{editingLibraryId ? 'Enregistrer' : 'Créer la bibliothèque'}</button>
          </div>
        </form>
      </Modal>

      {/* Modal pour créer un utilisateur */}
      <Modal isOpen={showUserModal} title="Créer un nouvel utilisateur" onClose={() => setShowUserModal(false)}>
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" placeholder="Nom *" value={adminForm.name} onChange={e=>setAdminForm({...adminForm,name:e.target.value})} />
            <input className="input" placeholder="Email *" value={adminForm.email} onChange={e=>setAdminForm({...adminForm,email:e.target.value})} />
            <input className="input" type="password" placeholder="Mot de passe *" value={adminForm.password} onChange={e=>setAdminForm({...adminForm,password:e.target.value})} />
            <select className="input" value={adminForm.role} onChange={e=>setAdminForm({...adminForm,role:e.target.value})}>
              <option value="">Sélectionner un rôle *</option>
              {availableRoles.length > 0 ? (
                availableRoles.map(role => (
                  <option key={role.id} value={role.name}>
                    {role.description || role.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="admin">Admin</option>
                  <option value="user">Utilisateur</option>
                </>
              )}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn" onClick={() => setShowUserModal(false)}>Annuler</button>
            <button className="btn btn-primary" type="submit">Créer l'utilisateur</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
