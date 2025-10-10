import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [bookQuery, setBookQuery] = useState('');
  const [libraryQuery, setLibraryQuery] = useState('');
  
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
      console.error('Erreur lors du chargement des livres:', error);
      toast.error('Erreur lors du chargement des livres');
    }
  };

  const loadLibraries = async () => {
    try {
      const params = {};
      if (libraryQuery) params.q = libraryQuery;
      const response = await adminService.getLibraries(params);
      const raw = response.data;
      const list = Array.isArray(raw) ? raw : (raw.libraries || raw.bibliotheques || []);
      setLibraries(list || []);
    } catch (error) {
      console.error('Erreur lors du chargement des bibliothèques:', error);
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

  const loadAdmins = async () => {
    try {
      const response = await adminService.getUsers();
      const raw = response.data;
      const list = Array.isArray(raw) ? raw : (raw.users || []);
      setAdmins(list);
    } catch (error) {
      console.error('Erreur lors du chargement des administrateurs:', error);
      toast.error('Erreur lors du chargement des administrateurs');
    }
  };

  const resetBookForm = () => setBookForm({
    title: '', author: '', published_at: '', genre: '', isbn: '', pages: '', language: 'Français', publisher: '', description: '', summary: '', coverImage: '', downloadLink: '', libraryId: ''
  });
  const resetLibraryForm = () => setLibraryForm({ name: '', address: '', arrondissement: '', phone: '', email: '', hours: '', description: '', website: '' });
  const resetAdminForm = () => setAdminForm({ name: '', email: '', password: '', role: 'admin' });

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
    } catch(err){ console.error(err); toast.error('Création livre échouée'); }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Supprimer ce livre ?')) return;
    try { await adminService.deleteBook(id); toast.info('Livre supprimé'); loadBooks(); } catch (e) { console.error(e); toast.error('Suppression échouée'); }
  };

  const startEditBook = (book) => {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    } catch (e) { console.error(e); toast.error('Création bibliothèque échouée'); }
  };

  const handleDeleteLibrary = async (id) => {
    if (!window.confirm('Supprimer cette bibliothèque ?')) return;
    try { await adminService.deleteLibrary(id); toast.info('Bibliothèque supprimée'); loadLibraries(); } catch (e) { console.error(e); toast.error('Suppression échouée'); }
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    } catch(e){ console.error(e); toast.error('Création utilisateur échouée'); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Supprimer utilisateur ?')) return;
    try { await adminService.deleteUser(id); toast.info('Utilisateur supprimé'); loadAdmins(); } catch(e){ console.error(e); toast.error('Suppression échouée'); }
  };

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
                  </div>

                  <form onSubmit={handleBookSubmit} className="bg-gray-50 p-6 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input className="input" placeholder="Titre *" value={bookForm.title} onChange={e=>setBookForm({...bookForm,title:e.target.value})} />
                    <input className="input" placeholder="Auteur *" value={bookForm.author} onChange={e=>setBookForm({...bookForm,author:e.target.value})} />
                    <select className="input" value={bookForm.libraryId} onChange={e=>setBookForm({...bookForm,libraryId:e.target.value})}>
                      <option value="">Bibliothèque *</option>
                      {libraries.map(l=> <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                    <input className="input" placeholder="Date publication (YYYY-MM-DD)" value={bookForm.published_at} onChange={e=>setBookForm({...bookForm,published_at:e.target.value})} />
                    <input className="input" placeholder="Genre" value={bookForm.genre} onChange={e=>setBookForm({...bookForm,genre:e.target.value})} />
                    <input className="input" placeholder="ISBN" value={bookForm.isbn} onChange={e=>setBookForm({...bookForm,isbn:e.target.value})} />
                    <input className="input" placeholder="Pages" value={bookForm.pages} onChange={e=>setBookForm({...bookForm,pages:e.target.value})} />
                    <input className="input" placeholder="Langue" value={bookForm.language} onChange={e=>setBookForm({...bookForm,language:e.target.value})} />
                    <input className="input" placeholder="Éditeur" value={bookForm.publisher} onChange={e=>setBookForm({...bookForm,publisher:e.target.value})} />
                    <input className="input" placeholder="Image (URL)" value={bookForm.coverImage} onChange={e=>setBookForm({...bookForm,coverImage:e.target.value})} />
                    <input className="input" placeholder="Lien téléchargement" value={bookForm.downloadLink} onChange={e=>setBookForm({...bookForm,downloadLink:e.target.value})} />
                    <textarea className="input col-span-full" rows={3} placeholder="Description" value={bookForm.description} onChange={e=>setBookForm({...bookForm,description:e.target.value})} />
                    <textarea className="input col-span-full" rows={3} placeholder="Résumé" value={bookForm.summary} onChange={e=>setBookForm({...bookForm,summary:e.target.value})} />
                    <div className="col-span-full flex gap-2">
                      <button className="btn btn-primary" type="submit">{editingBookId ? 'Enregistrer' : 'Créer'}</button>
                      {editingBookId ? (
                        <button type="button" className="btn" onClick={cancelEditBook}>Annuler</button>
                      ) : (
                        <button type="button" className="btn" onClick={resetBookForm}>Reset</button>
                      )}
                    </div>
                  </form>
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
                              (book.status === 'disponible')
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {book.status === 'disponible' ? 'Disponible' : 'Emprunté'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {book.bibliotheque_id || '-'}
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
                  </div>

                  <form onSubmit={handleLibrarySubmit} className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-6 gap-4">
                    <input className="input" placeholder="Nom *" value={libraryForm.name} onChange={e=>setLibraryForm({...libraryForm,name:e.target.value})} />
                    <input className="input" placeholder="Adresse *" value={libraryForm.address} onChange={e=>setLibraryForm({...libraryForm,address:e.target.value})} />
                    <input className="input" placeholder="Arr." value={libraryForm.arrondissement} onChange={e=>setLibraryForm({...libraryForm,arrondissement:e.target.value})} />
                    <input className="input" placeholder="Email" value={libraryForm.email} onChange={e=>setLibraryForm({...libraryForm,email:e.target.value})} />
                    <input className="input" placeholder="Téléphone" value={libraryForm.phone} onChange={e=>setLibraryForm({...libraryForm,phone:e.target.value})} />
                    <div className="flex gap-2">
                      <button className="btn btn-primary" type="submit">{editingLibraryId ? 'Enregistrer' : 'Ajouter'}</button>
                      {editingLibraryId ? (
                        <button type="button" className="btn" onClick={cancelEditLibrary}>Annuler</button>
                      ) : (
                        <button type="button" className="btn" onClick={resetLibraryForm}>Reset</button>
                      )}
                    </div>
                  </form>
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
                  <form onSubmit={handleAdminSubmit} className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input className="input" placeholder="Nom *" value={adminForm.name} onChange={e=>setAdminForm({...adminForm,name:e.target.value})} />
                    <input className="input" placeholder="Email *" value={adminForm.email} onChange={e=>setAdminForm({...adminForm,email:e.target.value})} />
                    <input className="input" type="password" placeholder="Mot de passe *" value={adminForm.password} onChange={e=>setAdminForm({...adminForm,password:e.target.value})} />
                    <select className="input" value={adminForm.role} onChange={e=>setAdminForm({...adminForm,role:e.target.value})}>
                      <option value="admin">admin</option>
                      <option value="user">user</option>
                    </select>
                    <div className="flex gap-2">
                      <button className="btn btn-primary" type="submit">Créer</button>
                      <button type="button" className="btn" onClick={resetAdminForm}>Reset</button>
                    </div>
                  </form>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {!readOnly && <button className="text-red-600 hover:underline text-xs" onClick={()=>handleDeleteUser(admin.id)}>Supprimer</button>}
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
    </div>
  );
};

export default AdminDashboard;