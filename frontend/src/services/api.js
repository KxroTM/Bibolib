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


// DEMO_MODE retiré

// Fonction helper pour simuler une réponse API
const mockApiResponse = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
};

// Intercepteur pour les requêtes (ajouter le token d'auth)
{
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Debug: afficher en dev si le token est présent lors des requêtes
      try {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.debug('[api] Request', config.method?.toUpperCase(), config.url, 'token?', !!token);
        }
      } catch (e) { /* noop */ }
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
}

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
};

// Service d'administration (CRUD réactivé)
export const adminService = {
  // Livres
  getBooks: (params = {}) => api.get(API_CONFIG.endpoints.books, { params })
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

  // Utilisateurs (fallback /users)
  getUsers: () => api.get('/users')
    .then(res => ({ data: Array.isArray(res.data) ? res.data : [] }))
    .catch(() => ({ data: [] })),
  createUser: (payload) => api.post('/users', payload), // legacy user creation
  updateUser: (id, payload) => api.put(`/users/${id}`, payload),
  deleteUser: (id) => api.delete(`/users/${id}`),

  // Réservations placeholder
  getReservations: () => Promise.resolve({ data: [] })
  ,
  // Logs (service externe activity_logs, par défaut sur :8080)
  getLogs: (params = {}) => {
    // Appelle l'API d'activity_logs directement (override baseURL)
    return axios.get('http://localhost:8080/logs', { params })
      .then(res => ({ data: res.data }))
      .catch(err => ({ error: err, data: { logs: [], total: 0, page: 1, limit: params.limit || 50, total_pages: 0 } }));
  }
};


export default api;