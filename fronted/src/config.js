// Configuration de l'API
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  endpoints: {
    // Auth
    login: '/auth/login',
    me: '/auth/me',
    
    // Libraries
    libraries: '/libraries',
    librariesArrondissements: '/libraries/arrondissements',
    
    // Books
    books: '/books',
    booksSearch: '/books/search',
    
    // Admin
    adminBooks: '/admin/books',
    adminLibraries: '/admin/libraries',
    adminUsers: '/admin/users',
    adminReservations: '/admin/reservations'
  }
};

export default API_CONFIG;