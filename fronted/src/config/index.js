// Configuration de l'API
const API_CONFIG = {
  // Base URL pour les appels API
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  // Timeout pour les requêtes
  timeout: 10000,
  
  // Endpoints
  endpoints: {
    // Authentification
    login: '/api/auth/login',
    me: '/api/auth/me',
    
    // Bibliothèques
    libraries: '/api/libraries',
    librariesArrondissements: '/api/libraries/arrondissements',
    
    // Livres
    books: '/api/books',
    booksSearch: '/api/books/search',
    
    // Admin
    adminBooks: '/api/admin/books',
    adminLibraries: '/api/admin/libraries',
    adminUsers: '/api/admin/users'
  }
};

// Configuration de l'application
export const APP_CONFIG = {
  name: 'BiboLib',
  version: '1.0.0',
  description: 'Bibliothèques de Paris',
  
  // Pagination
  pagination: {
    itemsPerPage: 12,
    adminItemsPerPage: 10
  },
  
  // Limites
  limits: {
    searchMinLength: 2,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
  
  // Messages par défaut
  messages: {
    loading: 'Chargement en cours...',
    error: 'Une erreur est survenue',
    noResults: 'Aucun résultat trouvé',
    networkError: 'Erreur de connexion'
  }
};

export default API_CONFIG;