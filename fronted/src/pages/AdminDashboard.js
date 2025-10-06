import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Modales
  const [showBookModal, setShowBookModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Formulaire livre
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    year: '',
    isbn: '',
    genre: '',
    pages: '',
    language: 'Français',
    publisher: '',
    description: '',
    summary: '',
    coverImage: '',
    downloadLink: '',
    libraryId: '',
    isAvailable: true
  });

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

  // Formulaire admin
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin'
  });

  useEffect(() => {
    loadData();
  }, [activeTab, currentPage]);

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
      const response = await adminService.getBooks({
        page: currentPage, 
        limit: itemsPerPage 
      });
      setBooks(response.data.books);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erreur lors du chargement des livres:', error);
      toast.error('Erreur lors du chargement des livres');
    }
  };

  const loadLibraries = async () => {
    try {
      const response = await adminService.getLibraries();
      setLibraries(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des bibliothèques:', error);
      toast.error('Erreur lors du chargement des bibliothèques');
    }
  };

  const loadAdmins = async () => {
    try {
      const response = await adminService.getUsers();
      setAdmins(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des administrateurs:', error);
      toast.error('Erreur lors du chargement des administrateurs');
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await adminService.updateBook(editingItem.id, bookForm);
        toast.success('Livre modifié avec succès !');
      } else {
        await adminService.createBook(bookForm);
        toast.success('Livre ajouté avec succès !');
      }
      setShowBookModal(false);
      resetBookForm();
      loadBooks();
    } catch (error) {
      toast.error('Erreur lors de l\'opération');
    }
  };

  const handleLibrarySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await adminService.updateLibrary(editingItem.id, libraryForm);
        toast.success('Bibliothèque modifiée avec succès !');
      } else {
        await adminService.createLibrary(libraryForm);
        toast.success('Bibliothèque ajoutée avec succès !');
      }
      setShowLibraryModal(false);
      resetLibraryForm();
      loadLibraries();
    } catch (error) {
      toast.error('Erreur lors de l\'opération');
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await adminService.updateUser(editingItem.id, adminForm);
        toast.success('Administrateur modifié avec succès !');
      } else {
        await adminService.createUser(adminForm);
        toast.success('Administrateur ajouté avec succès !');
      }
      setShowAdminModal(false);
      resetAdminForm();
      loadAdmins();
    } catch (error) {
      toast.error('Erreur lors de l\'opération');
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir promouvoir cet utilisateur en administrateur ?')) {
      return;
    }

    try {
      await adminService.updateUser(userId, { role: 'admin' });
      toast.success('Utilisateur promu administrateur avec succès !');
      loadAdmins();
    } catch (error) {
      toast.error('Erreur lors de la promotion');
    }
  };

  const handleDemoteFromAdmin = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir rétrograder cet administrateur en utilisateur ?')) {
      return;
    }

    try {
      await adminService.updateUser(userId, { role: 'user' });
      toast.success('Administrateur rétrogradé en utilisateur avec succès !');
      loadAdmins();
    } catch (error) {
      toast.error('Erreur lors de la rétrogradation');
    }
  };

  const handleDelete = async (type, id) => {
    const confirmMessage = type === 'users' 
      ? 'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible et doit être utilisée uniquement en cas de fraude avérée.'
      : 'Êtes-vous sûr de vouloir supprimer cet élément ?';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      if (type === 'books') {
        await adminService.deleteBook(id);
      } else if (type === 'libraries') {
        await adminService.deleteLibrary(id);
      } else if (type === 'users') {
        await adminService.deleteUser(id);
        toast.success('Utilisateur supprimé avec succès !');
      }
      
      if (type !== 'users') {
        toast.success('Élément supprimé avec succès !');
      }
      
      loadData();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const resetBookForm = () => {
    setBookForm({
      title: '',
      author: '',
      year: '',
      isbn: '',
      genre: '',
      pages: '',
      language: 'Français',
      publisher: '',
      description: '',
      summary: '',
      coverImage: '',
      downloadLink: '',
      libraryId: '',
      isAvailable: true
    });
    setEditingItem(null);
  };

  const resetLibraryForm = () => {
    setLibraryForm({
      name: '',
      address: '',
      arrondissement: '',
      phone: '',
      email: '',
      hours: '',
      description: '',
      website: ''
    });
    setEditingItem(null);
  };

  const resetAdminForm = () => {
    setAdminForm({
      name: '',
      email: '',
      password: '',
      role: 'admin'
    });
    setEditingItem(null);
  };

  const openBookModal = (book = null) => {
    if (book) {
      setBookForm(book);
      setEditingItem(book);
    } else {
      resetBookForm();
    }
    setShowBookModal(true);
  };

  const openLibraryModal = (library = null) => {
    if (library) {
      setLibraryForm(library);
      setEditingItem(library);
    } else {
      resetLibraryForm();
    }
    setShowLibraryModal(true);
  };

  const openAdminModal = (admin = null) => {
    if (admin) {
      setAdminForm({ ...admin, password: '' });
      setEditingItem(admin);
    } else {
      resetAdminForm();
    }
    setShowAdminModal(true);
  };

  const tabs = [
    { id: 'books', label: '📚 Livres', count: books.length },
    { id: 'libraries', label: '🏛️ Bibliothèques', count: libraries.length },
    { id: 'admins', label: '👥 Administrateurs', count: admins.length }
  ];

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Panneau d'Administration
        </h1>
        <p className="text-gray-600">
          Gérez les livres, bibliothèques et administrateurs de BiboLib
        </p>
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
          {/* Bouton d'ajout */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'books' && 'Gestion des Livres'}
              {activeTab === 'libraries' && 'Gestion des Bibliothèques'}
              {activeTab === 'admins' && 'Gestion des Administrateurs'}
            </h2>
            
            {activeTab === 'books' && (
              <button
                onClick={() => openBookModal()}
                className="btn-primary"
              >
                + Ajouter un livre
              </button>
            )}
            
            {activeTab === 'libraries' && (
              <button
                onClick={() => openLibraryModal()}
                className="btn-primary"
              >
                + Ajouter une bibliothèque
              </button>
            )}
            
            {activeTab === 'admins' && (
              <button
                onClick={() => openAdminModal()}
                className="btn-primary"
              >
                + Ajouter un admin
              </button>
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
                              book.isAvailable 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {book.isAvailable ? 'Disponible' : 'Emprunté'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {book.libraryName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => openBookModal(book)}
                              className="text-primary-600 hover:text-primary-900 mr-3"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDelete('books', book.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table des bibliothèques */}
              {activeTab === 'libraries' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {libraries.map((library) => (
                    <div key={library.id} className="card p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {library.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          library.isOpen 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {library.isOpen ? 'Ouvert' : 'Fermé'}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">
                          📍 {library.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          🏛️ {library.arrondissement} arrondissement
                        </p>
                        <p className="text-sm text-gray-600">
                          📚 {library.bookCount || 0} livres
                        </p>
                        {library.phone && (
                          <p className="text-sm text-gray-600">
                            📞 {library.phone}
                          </p>
                        )}
                        {library.email && (
                          <p className="text-sm text-gray-600">
                            ✉️ {library.email}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openLibraryModal(library)}
                          className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete('libraries', library.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Table des administrateurs */}
              {activeTab === 'admins' && (
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
                          Dernière connexion
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
                                    {admin.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                                <div className="text-sm text-gray-500">ID: {admin.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {admin.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              admin.role === 'admin' 
                                ? 'bg-red-100 text-red-800'
                                : admin.role === 'moderator'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {admin.role === 'admin' ? 'Administrateur' : 
                               admin.role === 'moderator' ? 'Modérateur' : 'Utilisateur'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Actif
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString('fr-FR') : 'Jamais'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {admin.role !== 'admin' && (
                                <button
                                  onClick={() => handlePromoteToAdmin(admin.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="Promouvoir en admin"
                                >
                                  ⬆️ Admin
                                </button>
                              )}
                              {admin.role === 'admin' && admin.email !== 'admin@bibolib.fr' && (
                                <button
                                  onClick={() => handleDemoteFromAdmin(admin.id)}
                                  className="text-orange-600 hover:text-orange-900"
                                  title="Rétrograder"
                                >
                                  ⬇️ User
                                </button>
                              )}
                              <button
                                onClick={() => openAdminModal(admin)}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Modifier
                              </button>
                              {admin.email !== 'admin@bibolib.fr' && (
                                <button
                                  onClick={() => handleDelete('users', admin.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Supprimer (fraude)"
                                >
                                  🚫 Supprimer
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

      {/* Modal Livre */}
      {showBookModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? 'Modifier le livre' : 'Ajouter un livre'}
              </h3>
              
              <form onSubmit={handleBookSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookForm.title}
                      onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Auteur *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookForm.author}
                      onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Année
                    </label>
                    <input
                      type="number"
                      value={bookForm.year}
                      onChange={(e) => setBookForm({...bookForm, year: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Genre
                    </label>
                    <input
                      type="text"
                      value={bookForm.genre}
                      onChange={(e) => setBookForm({...bookForm, genre: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISBN
                    </label>
                    <input
                      type="text"
                      value={bookForm.isbn}
                      onChange={(e) => setBookForm({...bookForm, isbn: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pages
                    </label>
                    <input
                      type="number"
                      value={bookForm.pages}
                      onChange={(e) => setBookForm({...bookForm, pages: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Langue
                    </label>
                    <select
                      value={bookForm.language}
                      onChange={(e) => setBookForm({...bookForm, language: e.target.value})}
                      className="input-field"
                    >
                      <option value="Français">Français</option>
                      <option value="Anglais">Anglais</option>
                      <option value="Espagnol">Espagnol</option>
                      <option value="Allemand">Allemand</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Éditeur
                    </label>
                    <input
                      type="text"
                      value={bookForm.publisher}
                      onChange={(e) => setBookForm({...bookForm, publisher: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={bookForm.description}
                    onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de l'image de couverture
                  </label>
                  <input
                    type="url"
                    value={bookForm.coverImage}
                    onChange={(e) => setBookForm({...bookForm, coverImage: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lien de téléchargement
                  </label>
                  <input
                    type="url"
                    value={bookForm.downloadLink}
                    onChange={(e) => setBookForm({...bookForm, downloadLink: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={bookForm.isAvailable}
                    onChange={(e) => setBookForm({...bookForm, isAvailable: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                    Livre disponible
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookModal(false)}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingItem ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Bibliothèque */}
      {showLibraryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? 'Modifier la bibliothèque' : 'Ajouter une bibliothèque'}
              </h3>
              
              <form onSubmit={handleLibrarySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de la bibliothèque *
                    </label>
                    <input
                      type="text"
                      required
                      value={libraryForm.name}
                      onChange={(e) => setLibraryForm({...libraryForm, name: e.target.value})}
                      className="input-field"
                      placeholder="Bibliothèque Forney"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arrondissement *
                    </label>
                    <select
                      required
                      value={libraryForm.arrondissement}
                      onChange={(e) => setLibraryForm({...libraryForm, arrondissement: e.target.value})}
                      className="input-field"
                    >
                      <option value="">Sélectionner</option>
                      {['1er', '2e', '3e', '4e', '5e', '6e', '7e', '8e', '9e', '10e',
                        '11e', '12e', '13e', '14e', '15e', '16e', '17e', '18e', '19e', '20e'].map(arr => (
                        <option key={arr} value={arr}>{arr}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse complète *
                  </label>
                  <input
                    type="text"
                    required
                    value={libraryForm.address}
                    onChange={(e) => setLibraryForm({...libraryForm, address: e.target.value})}
                    className="input-field"
                    placeholder="1 Rue du Figuier, 75004 Paris"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={libraryForm.phone}
                      onChange={(e) => setLibraryForm({...libraryForm, phone: e.target.value})}
                      className="input-field"
                      placeholder="01 42 78 14 60"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={libraryForm.email}
                      onChange={(e) => setLibraryForm({...libraryForm, email: e.target.value})}
                      className="input-field"
                      placeholder="contact@bibliotheque.paris.fr"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horaires d'ouverture
                  </label>
                  <input
                    type="text"
                    value={libraryForm.hours}
                    onChange={(e) => setLibraryForm({...libraryForm, hours: e.target.value})}
                    className="input-field"
                    placeholder="Mar-Sam: 10h-19h, Dim: 13h-19h"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site web
                  </label>
                  <input
                    type="url"
                    value={libraryForm.website}
                    onChange={(e) => setLibraryForm({...libraryForm, website: e.target.value})}
                    className="input-field"
                    placeholder="https://www.paris.fr/equipements/..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={libraryForm.description}
                    onChange={(e) => setLibraryForm({...libraryForm, description: e.target.value})}
                    className="input-field"
                    placeholder="Description de la bibliothèque, ses spécialités, ses services..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLibraryModal(false)}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingItem ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Admin */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? 'Modifier l\'administrateur' : 'Ajouter un administrateur'}
              </h3>
              
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({...adminForm, name: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe {editingItem ? '(laisser vide pour ne pas changer)' : '*'}
                  </label>
                  <input
                    type="password"
                    required={!editingItem}
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle
                  </label>
                  <select
                    value={adminForm.role}
                    onChange={(e) => setAdminForm({...adminForm, role: e.target.value})}
                    className="input-field"
                  >
                    <option value="admin">Administrateur</option>
                    <option value="moderator">Modérateur</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(false)}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingItem ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;