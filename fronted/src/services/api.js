import axios from 'axios';
import API_CONFIG from '../config';

// Données de démonstration
import { demoLibraries, demoBooks, demoAdmins, demoUsers } from './demoData';

// Configuration globale d'Axios (utilisé si backend disponible)
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Mode démo (sans backend)
const DEMO_MODE = !process.env.REACT_APP_API_URL || process.env.REACT_APP_DEMO_MODE === 'true';

// Fonction helper pour simuler une réponse API
const mockApiResponse = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
};

// Intercepteur pour les requêtes (ajouter le token d'auth)
if (!DEMO_MODE) {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Intercepteur pour les réponses (gestion des erreurs)
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expiré ou invalide
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
}

// Service d'authentification
export const authService = {
  login: (email, password) => {
    if (DEMO_MODE) {
      // Chercher l'utilisateur dans la base de données de démo
      const user = demoUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        const token = 'demo-jwt-token';
        const userResponse = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        return mockApiResponse({ token, user: userResponse });
      } else {
        return Promise.reject({ response: { data: { message: 'Identifiants incorrects' } } });
      }
    }
    return api.post(API_CONFIG.endpoints.login, { email, password });
  },
  
  me: () => {
    if (DEMO_MODE) {
      // Récupérer l'utilisateur depuis le token stocké (simulation)
      const userEmail = localStorage.getItem('userEmail') || 'admin@bibolib.fr';
      const user = demoUsers.find(u => u.email === userEmail);
      
      if (user) {
        return mockApiResponse({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        });
      }
      return Promise.reject({ response: { status: 401 } });
    }
    return api.get(API_CONFIG.endpoints.me);
  },
};

// Service des bibliothèques
export const libraryService = {
  getAll: (params = {}) => {
    if (DEMO_MODE) {
      const { page = 1, limit = 12, arrondissement } = params;
      let filteredLibraries = [...demoLibraries];
      
      if (arrondissement) {
        filteredLibraries = filteredLibraries.filter(lib => lib.arrondissement === arrondissement);
      }
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedLibraries = filteredLibraries.slice(startIndex, endIndex);
      
      return mockApiResponse({
        libraries: paginatedLibraries,
        totalPages: Math.ceil(filteredLibraries.length / limit),
        currentPage: page,
        total: filteredLibraries.length
      });
    }
    return api.get(API_CONFIG.endpoints.libraries, { params });
  },
  
  getById: (id) => {
    if (DEMO_MODE) {
      const library = demoLibraries.find(lib => lib.id === parseInt(id));
      return library ? mockApiResponse(library) : Promise.reject({ response: { status: 404 } });
    }
    return api.get(`${API_CONFIG.endpoints.libraries}/${id}`);
  },
  
  getBooks: (id, params = {}) => {
    if (DEMO_MODE) {
      const { page = 1, limit = 12, genre, availability } = params;
      let libraryBooks = demoBooks.filter(book => book.libraryId === parseInt(id));
      
      if (genre) {
        libraryBooks = libraryBooks.filter(book => book.genre === genre);
      }
      
      if (availability === 'available') {
        libraryBooks = libraryBooks.filter(book => book.isAvailable);
      } else if (availability === 'borrowed') {
        libraryBooks = libraryBooks.filter(book => !book.isAvailable);
      }
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBooks = libraryBooks.slice(startIndex, endIndex);
      
      return mockApiResponse({
        books: paginatedBooks,
        totalPages: Math.ceil(libraryBooks.length / limit),
        currentPage: page,
        total: libraryBooks.length
      });
    }
    return api.get(`${API_CONFIG.endpoints.libraries}/${id}/books`, { params });
  },
  
  getGenres: (id) => {
    if (DEMO_MODE) {
      const libraryBooks = demoBooks.filter(book => book.libraryId === parseInt(id));
      const genres = [...new Set(libraryBooks.map(book => book.genre))].filter(Boolean);
      return mockApiResponse(genres);
    }
    return api.get(`${API_CONFIG.endpoints.libraries}/${id}/genres`);
  },
  
  getArrondissements: () => {
    if (DEMO_MODE) {
      const arrondissements = [...new Set(demoLibraries.map(lib => lib.arrondissement))];
      return mockApiResponse(arrondissements);
    }
    return api.get(API_CONFIG.endpoints.librariesArrondissements);
  },
  
  searchBooks: (id, query) => {
    if (DEMO_MODE) {
      const libraryBooks = demoBooks.filter(book => book.libraryId === parseInt(id));
      const searchResults = libraryBooks.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
      );
      return mockApiResponse(searchResults);
    }
    return api.get(`${API_CONFIG.endpoints.libraries}/${id}/books/search`, { params: { q: query } });
  },
};

// Service des livres
export const bookService = {
  search: (query, params = {}) => {
    if (DEMO_MODE) {
      const searchResults = demoBooks.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.description.toLowerCase().includes(query.toLowerCase())
      );
      return mockApiResponse(searchResults);
    }
    return api.get(API_CONFIG.endpoints.booksSearch, { params: { q: query, ...params } });
  },
  
  getById: (id) => {
    if (DEMO_MODE) {
      const book = demoBooks.find(b => b.id === parseInt(id));
      if (book) {
        const library = demoLibraries.find(lib => lib.id === book.libraryId);
        return mockApiResponse({ book, library });
      }
      return Promise.reject({ response: { status: 404 } });
    }
    return api.get(`${API_CONFIG.endpoints.books}/${id}`);
  },
  
  reserve: (id, userId) => {
    if (DEMO_MODE) {
      const book = demoBooks.find(b => b.id === parseInt(id));
      if (book && book.status === 'available') {
        // Simuler la réservation
        const reservationExpires = new Date();
        reservationExpires.setDate(reservationExpires.getDate() + 3);
        
        book.status = 'reserved';
        book.reservedBy = userId;
        book.reservedAt = new Date().toISOString();
        book.reservationExpires = reservationExpires.toISOString();
        
        return mockApiResponse({ 
          success: true, 
          message: 'Livre réservé avec succès pour 3 jours',
          book: book
        });
      }
      return Promise.reject({ response: { data: { message: 'Livre non disponible pour réservation' } } });
    }
    return api.post(`${API_CONFIG.endpoints.books}/${id}/reserve`);
  },

  cancelReservation: (id, userId) => {
    if (DEMO_MODE) {
      const book = demoBooks.find(b => b.id === parseInt(id));
      if (book && book.status === 'reserved' && book.reservedBy === userId) {
        book.status = 'available';
        book.reservedBy = null;
        book.reservedAt = null;
        book.reservationExpires = null;
        
        return mockApiResponse({ 
          success: true, 
          message: 'Réservation annulée avec succès',
          book: book
        });
      }
      return Promise.reject({ response: { data: { message: 'Impossible d\'annuler cette réservation' } } });
    }
    return api.delete(`${API_CONFIG.endpoints.books}/${id}/reserve`);
  },
  
  borrow: (id, userId) => {
    if (DEMO_MODE) {
      const book = demoBooks.find(b => b.id === parseInt(id));
      if (book && (book.status === 'available' || (book.status === 'reserved' && book.reservedBy === userId))) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); // 2 semaines d'emprunt
        
        book.status = 'borrowed';
        book.borrowedBy = userId;
        book.borrowedAt = new Date().toISOString();
        book.dueDate = dueDate.toISOString();
        // Nettoyer les données de réservation
        book.reservedBy = null;
        book.reservedAt = null;
        book.reservationExpires = null;
        
        return mockApiResponse({ 
          success: true, 
          message: 'Livre emprunté avec succès pour 2 semaines',
          book: book
        });
      }
      return Promise.reject({ response: { data: { message: 'Livre non disponible pour emprunt' } } });
    }
    return api.post(`${API_CONFIG.endpoints.books}/${id}/borrow`);
  },

  returnBook: (id, userId) => {
    if (DEMO_MODE) {
      const book = demoBooks.find(b => b.id === parseInt(id));
      if (book && book.status === 'borrowed' && book.borrowedBy === userId) {
        book.status = 'available';
        book.borrowedBy = null;
        book.borrowedAt = null;
        book.dueDate = null;
        
        return mockApiResponse({ 
          success: true, 
          message: 'Livre retourné avec succès',
          book: book
        });
      }
      return Promise.reject({ response: { data: { message: 'Impossible de retourner ce livre' } } });
    }
    return api.post(`${API_CONFIG.endpoints.books}/${id}/return`);
  },
};

// Service d'administration
export const adminService = {
  // Gestion des livres
  getBooks: (params = {}) => {
    if (DEMO_MODE) {
      const { page = 1, limit = 10 } = params;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBooks = demoBooks.slice(startIndex, endIndex);
      
      return mockApiResponse({
        books: paginatedBooks,
        totalPages: Math.ceil(demoBooks.length / limit),
        currentPage: page,
        total: demoBooks.length
      });
    }
    return api.get(API_CONFIG.endpoints.adminBooks, { params });
  },
  
  createBook: (bookData) => {
    if (DEMO_MODE) {
      const newBook = { ...bookData, id: Date.now() };
      return mockApiResponse(newBook);
    }
    return api.post(API_CONFIG.endpoints.adminBooks, bookData);
  },
  
  updateBook: (id, bookData) => {
    if (DEMO_MODE) {
      return mockApiResponse({ ...bookData, id });
    }
    return api.put(`${API_CONFIG.endpoints.adminBooks}/${id}`, bookData);
  },
  
  deleteBook: (id) => {
    if (DEMO_MODE) {
      return mockApiResponse({ success: true });
    }
    return api.delete(`${API_CONFIG.endpoints.adminBooks}/${id}`);
  },
  
  // Gestion des bibliothèques
  getLibraries: () => {
    if (DEMO_MODE) {
      return mockApiResponse(demoLibraries);
    }
    return api.get(API_CONFIG.endpoints.adminLibraries);
  },
  
  createLibrary: (libraryData) => {
    if (DEMO_MODE) {
      const newLibrary = { ...libraryData, id: Date.now() };
      return mockApiResponse(newLibrary);
    }
    return api.post(API_CONFIG.endpoints.adminLibraries, libraryData);
  },
  
  updateLibrary: (id, libraryData) => {
    if (DEMO_MODE) {
      return mockApiResponse({ ...libraryData, id });
    }
    return api.put(`${API_CONFIG.endpoints.adminLibraries}/${id}`, libraryData);
  },
  
  deleteLibrary: (id) => {
    if (DEMO_MODE) {
      return mockApiResponse({ success: true });
    }
    return api.delete(`${API_CONFIG.endpoints.adminLibraries}/${id}`);
  },
  
  // Gestion des utilisateurs
  getUsers: () => {
    if (DEMO_MODE) {
      return mockApiResponse(demoAdmins);
    }
    return api.get(API_CONFIG.endpoints.adminUsers);
  },

  // Gestion des réservations
  getReservations: () => {
    if (DEMO_MODE) {
      const reservedBooks = demoBooks.filter(book => book.status === 'reserved');
      const reservationsWithUserData = reservedBooks.map(book => {
        const user = demoUsers.find(u => u.id === book.reservedBy);
        return {
          ...book,
          reservedUserName: user?.name || 'Utilisateur inconnu',
          reservedUserEmail: user?.email || 'Email inconnu'
        };
      });
      return mockApiResponse(reservationsWithUserData);
    }
    return api.get(API_CONFIG.endpoints.adminReservations);
  },

  markAsPickedUp: (bookId) => {
    if (DEMO_MODE) {
      const book = demoBooks.find(b => b.id === parseInt(bookId));
      if (book && book.status === 'reserved') {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); // 2 semaines d'emprunt
        
        book.status = 'borrowed';
        book.borrowedBy = book.reservedBy;
        book.borrowedAt = new Date().toISOString();
        book.dueDate = dueDate.toISOString();
        // Nettoyer les données de réservation
        book.reservedBy = null;
        book.reservedAt = null;
        book.reservationExpires = null;
        
        return mockApiResponse({ success: true, message: 'Livre marqué comme emprunté' });
      }
      return Promise.reject({ response: { data: { message: 'Impossible de marquer ce livre comme emprunté' } } });
    }
    return api.post(`${API_CONFIG.endpoints.adminBooks}/${bookId}/pickup`);
  },
  
  createUser: (userData) => {
    if (DEMO_MODE) {
      const newUser = { ...userData, id: Date.now(), createdAt: new Date().toISOString() };
      return mockApiResponse(newUser);
    }
    return api.post(API_CONFIG.endpoints.adminUsers, userData);
  },
  
  updateUser: (id, userData) => {
    if (DEMO_MODE) {
      return mockApiResponse({ ...userData, id });
    }
    return api.put(`${API_CONFIG.endpoints.adminUsers}/${id}`, userData);
  },
  
  deleteUser: (id) => {
    if (DEMO_MODE) {
      return mockApiResponse({ success: true });
    }
    return api.delete(`${API_CONFIG.endpoints.adminUsers}/${id}`);
  },
};

export default api;