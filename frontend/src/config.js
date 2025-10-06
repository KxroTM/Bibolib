// Configuration de l'API
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/',
  timeout: 10000,
  endpoints: {
    // Auth
    login: '/auth/login',
    me: '/auth/me',
    
    // Libraries
    libraries: '/bibliotheques',
    librariesArrondissements: '/bibliotheques/arrondissements',
    
    // Books
    books: '/books',
    booksSearch: '/books/search',
    
    // Admin
    adminBooks: '/admin/books',
    adminLibraries: '/admin/bibliotheques',
    adminUsers: '/admin/users',
    adminReservations: '/admin/reservations'
  }
};

export default API_CONFIG;