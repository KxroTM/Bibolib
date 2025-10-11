import axios from 'axios';
import API_CONFIG from '../config'; // resolves to config/index.js

// Données de démonstration
// Mode démo supprimé : toutes les données viennent maintenant du backend

// Configuration globale d'Axios (utilisé si backend disponible)
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour les requêtes (ajouter le token d'auth)
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
      // Ne pas rediriger pendant une tentative de login pour pouvoir afficher le message d'erreur
      const isLoginAttempt = (error?.config?.url || '').includes('/auth/login');
      if (error.response?.status === 401 && !isLoginAttempt) {
        localStorage.removeItem('token');
        // On laisse la page actuelle décider (ex: ProtectedRoute) -> pas de redirection immédiate
      }
      return Promise.reject(error);
    }
  );

// Service d'authentification
export const authService = {
  login: (email, password) => api.post(API_CONFIG.endpoints.login, { email, password }),
  me: () => api.get(API_CONFIG.endpoints.me)
};

// Service des bibliothèques
export const libraryService = {
  getAll: (params = {}) => {
    return api.get(API_CONFIG.endpoints.libraries, { params })
      .then(res => {
        // Nouveau backend renvoie {libraries, totalPages, currentPage, total}
        if (res.data && Array.isArray(res.data.libraries)) {
          return { data: res.data };
        }
        // Ancien format tableau simple
        if (Array.isArray(res.data)) {
          return {
            data: {
              libraries: res.data,
              totalPages: 1,
              currentPage: 1,
              total: res.data.length
            }
          };
        }
        return res;
      })
      .catch(err => {
        return { data: { libraries: [], totalPages: 1, currentPage: 1, total: 0 }, error: err };
      });
  },
  
  getById: (id) => {
    return api.get(`${API_CONFIG.endpoints.libraries}/${id}`);
  },
  
  getBooks: (id, params = {}) => {
    return api.get(`${API_CONFIG.endpoints.libraries}/${id}/books`, { params })
      .then(res => {
        // Nouveau backend renvoie {books, totalPages, currentPage, total}
        if (res.data && Array.isArray(res.data.books)) {
          return { data: res.data };
        }
        // Ancien format tableau simple
        if (Array.isArray(res.data)) {
          return {
            data: {
              books: res.data,
              totalPages: 1,
              currentPage: 1,
              total: res.data.length
            }
          };
        }
        return res;
      })
      .catch(err => {
        return { data: { books: [], totalPages: 1, currentPage: 1, total: 0 }, error: err };
      });
  },
  
  getGenres: (id) => {
    return api.get(`${API_CONFIG.endpoints.libraries}/${id}/genres`);
  },
  
  getArrondissements: () => {
    return api.get(API_CONFIG.endpoints.librariesArrondissements);
  },
  
  searchBooks: (id, query) => {
    return api.get(`${API_CONFIG.endpoints.libraries}/${id}/books/search`, { params: { q: query } })
      .then(res => {
        // Nouveau backend renvoie {books, totalPages, currentPage, total}
        if (res.data && Array.isArray(res.data.books)) {
          return { data: res.data.books };
        }
        // Ancien format tableau simple
        if (Array.isArray(res.data)) {
          return { data: res.data };
        }
        return { data: [] };
      })
      .catch(err => {
        return { data: [], error: err };
      });
  },
};

// Service des livres
export const bookService = {
  // Récupérer tous les livres (public - pas besoin d'auth)
  getAll: (params = {}) => {
    return api.get('/books', { params })
      .then(res => {
        // Format cohérent avec adminService.getBooks
        if (res.data && Array.isArray(res.data.books)) {
          return { data: res.data };
        }
        // Fallback si format différent
        if (Array.isArray(res.data)) {
          return { data: { books: res.data, total: res.data.length } };
        }
        return { data: { books: [], total: 0 } };
      })
      .catch(err => {
        return { data: { books: [], total: 0 }, error: err };
      });
  },

  search: (query, params = {}) => {
    return api.get(API_CONFIG.endpoints.booksSearch, { params: { q: query, ...params } })
      .then(res => {
        // Nouveau backend renvoie {books, totalPages, currentPage, total}
        if (res.data && Array.isArray(res.data.books)) {
          return { data: res.data.books };
        }
        // Ancien format tableau simple
        if (Array.isArray(res.data)) {
          return { data: res.data };
        }
        return { data: [] };
      })
      .catch(err => {
        return { data: [], error: err };
      });
  },
  
  getById: (id) => {
    return api.get(`${API_CONFIG.endpoints.books}/${id}`);
  },
  
  reserve: (id, userId) => {
    return api.post(`${API_CONFIG.endpoints.books}/${id}/reserve`);
  },

  cancelReservation: (id, userId) => {
    return api.delete(`${API_CONFIG.endpoints.books}/${id}/reserve`);
  },
  
  borrow: (id, userId) => {
    return api.post(`${API_CONFIG.endpoints.books}/${id}/borrow`);
  },

  returnBook: (id, userId) => {
    return api.post(`${API_CONFIG.endpoints.books}/${id}/return`);
  },

  getRecentBooks: (limit = 8) => {
    return api.get(API_CONFIG.endpoints.booksRecent, { params: { limit } })
      .then(res => ({ data: Array.isArray(res.data) ? res.data : [] }))
      .catch(() => ({ data: [] }));
  },

  getFeaturedBooks: (limit = 8) => {
    return api.get(API_CONFIG.endpoints.booksFeatured, { params: { limit } })
      .then(res => ({ data: Array.isArray(res.data) ? res.data : [] }))
      .catch(() => ({ data: [] }));
  },
};

// Service d'administration (CRUD réactivé)
export const adminService = {
  // Livres - utiliser l'endpoint admin pour avoir les noms des bibliothèques
  getBooks: (params = {}) => api.get('/admin/books', { params })
    .then(res => {
      const data = res.data;
      // Nouveau backend renvoie {books, totalPages, currentPage, total}
      if (data && Array.isArray(data.books)) {
        return { data: data.books, meta: { total: data.total, totalPages: data.totalPages, currentPage: data.currentPage } };
      }
      // Ancien format tableau simple
      if (Array.isArray(data)) {
        return { data };
      }
      return { data: [] };
    })
    .catch(() => ({ data: [] })),
  createBook: (payload) => api.post(API_CONFIG.endpoints.books, payload),
  updateBook: (id, payload) => api.put(`${API_CONFIG.endpoints.books}/${id}`, payload),
  deleteBook: (id) => api.delete(`${API_CONFIG.endpoints.books}/${id}`),

  // Bibliothèques (alias admin pour GET, public pour mutations)
  getLibraries: (params = {}) => {
    const finalParams = { limit: 500, ...params };
    return api.get(API_CONFIG.endpoints.adminLibraries, { params: finalParams })
      .then(res => {
        const d = res.data;
        if (d && Array.isArray(d.libraries)) {
          return { data: d.libraries, meta: { total: d.total, totalPages: d.totalPages, currentPage: d.currentPage } };
        }
        if (Array.isArray(d)) return { data: d };
        return { data: [] };
      })
      .catch(() => ({ data: [] }));
  },
  createLibrary: (payload) => api.post(API_CONFIG.endpoints.libraries, payload),
  updateLibrary: (id, payload) => api.put(`${API_CONFIG.endpoints.libraries}/${id}`, payload),
  deleteLibrary: (id) => api.delete(`${API_CONFIG.endpoints.libraries}/${id}`),

  // Utilisateurs (Admin avec pagination et recherche)
  getUsers: (params = {}) => {
    const finalParams = { limit: 50, ...params };
    return api.get(API_CONFIG.endpoints.adminUsers, { params: finalParams })
      .then(res => {
        const d = res.data;
        if (d && Array.isArray(d.users)) {
          return { data: d.users, meta: { total: d.total, totalPages: d.totalPages, currentPage: d.currentPage } };
        }
        if (Array.isArray(d)) return { data: d };
        return { data: [] };
      })
      .catch(() => ({ data: [] }));
  },
  createUser: (payload) => api.post('/users', payload), // legacy user creation
  updateUser: (id, payload) => api.put(`/users/${id}`, payload),
  deleteUser: (id) => api.delete(`/users/${id}`),

  // Gestion des rôles utilisateurs
  assignRoleToUser: (userId, roleId) => api.post(`/admin/users/${userId}/roles`, { role_id: roleId }),
  removeRoleFromUser: (userId, roleId) => api.delete(`/admin/users/${userId}/roles/${roleId}`),
  getRoles: () => api.get('/admin/roles').then(res => ({ data: res.data.roles || [] })),

  // Réservations et emprunts - nouveau système
  getReservations: () => Promise.resolve({ data: [] }),
  
  // Nouvelles fonctions pour le système de réservation
  reserveBook: (bookId) => api.post(`/books/${bookId}/reserve`),
  cancelReservation: (bookId) => api.delete(`/books/${bookId}/reserve`),
  
  // Endpoints utilisateur
  getMyLoans: () => api.get('/my-loans'),
  getMyReservations: () => api.get('/my-reservations'),
  requestExtension: (reservationId) => api.post(`/loans/${reservationId}/request-extension`),
  
  // Endpoints admin pour validation
  getPendingReservations: (params = {}) => api.get('/admin/reservations/pending', { params }),
  validatePickup: (reservationId) => api.post(`/admin/reservations/${reservationId}/validate`),
  rejectReservation: (reservationId, reason = '') => api.post(`/admin/reservations/${reservationId}/reject`, { reason }),
  
  // Endpoints admin pour prolongations
  getPendingExtensions: () => api.get('/admin/extensions/pending'),
  grantExtension: (reservationId, days = 30) => api.post(`/admin/extensions/${reservationId}/grant`, { days }),
  denyExtension: (reservationId) => api.post(`/admin/extensions/${reservationId}/deny`),
  
  // Nettoyage automatique
  cleanupExpired: () => api.post('/admin/cleanup-expired'),
  
  // Endpoints admin pour gestion des emprunts
  getActiveLoans: (params = {}) => api.get('/admin/loans/active', { params }),
  returnLoan: (reservationId) => api.post(`/admin/loans/${reservationId}/return`),
  
  // Endpoint de retour de livre (admin) - legacy
  returnBook: (bookId) => api.post(`/books/${bookId}/return`),
  
  // Logs (service externe activity_logs, par défaut sur :8080)
  getLogs: (params = {}) => {
    // Appelle l'API d'activity_logs directement (override baseURL)
    return axios.get('http://localhost:8080/logs', { params })
      .then(res => ({ data: res.data }))
      .catch(err => ({ error: err, data: { logs: [], total: 0, page: 1, limit: params.limit || 50, total_pages: 0 } }));
  }
};


export default api;