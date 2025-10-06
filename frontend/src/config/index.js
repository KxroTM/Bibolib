// Configuration de l'API
const API_CONFIG = {
  // Base URL pour les appels API
  // On force un /api si non fourni pour rester cohérent avec les endpoints backend /api/auth/*
  baseURL: (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, ''),
  
  // Timeout pour les requêtes
  timeout: 10000,
  
  // Endpoints
  endpoints: {
    // Authentification
  login: '/api/auth/login',
  me: '/api/auth/me',
    
    // Bibliothèques
  libraries: '/bibliotheques',
  librariesArrondissements: '/bibliotheques/arrondissements',
    
    // Livres
  books: '/books',
  booksSearch: '/books/search',
    
    // Admin
  // Admin (réutilise les endpoints publics pour affichage dashboard)
  adminBooks: '/books',
  adminLibraries: '/admin/bibliotheques',
  adminUsers: '/users',
  adminReservations: '/reservations' // (non implémenté côté back pour l'instant)
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