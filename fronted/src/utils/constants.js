// Constantes de l'application

// Genres de livres
export const BOOK_GENRES = [
  'Aventure',
  'Biographie',
  'Classique',
  'Comédie',
  'Drame',
  'Essai',
  'Fantastique',
  'Fiction',
  'Histoire',
  'Horreur',
  'Jeunesse',
  'Mystère',
  'Philosophie',
  'Poésie',
  'Politique',
  'Romance',
  'Science-Fiction',
  'Thriller',
  'Voyage'
];

// Langues disponibles
export const LANGUAGES = [
  'Français',
  'Anglais',
  'Espagnol',
  'Allemand',
  'Italien',
  'Portugais',
  'Russe',
  'Chinois',
  'Japonais',
  'Arabe'
];

// Arrondissements de Paris
export const PARIS_ARRONDISSEMENTS = [
  '1er', '2e', '3e', '4e', '5e', '6e', '7e', '8e', '9e', '10e',
  '11e', '12e', '13e', '14e', '15e', '16e', '17e', '18e', '19e', '20e'
];

// Statuts de disponibilité
export const AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  BORROWED: 'borrowed',
  RESERVED: 'reserved',
  MAINTENANCE: 'maintenance'
};

// Messages de toast
export const TOAST_MESSAGES = {
  SUCCESS: {
    BOOK_ADDED: 'Livre ajouté avec succès !',
    BOOK_UPDATED: 'Livre modifié avec succès !',
    BOOK_DELETED: 'Livre supprimé avec succès !',
    BOOK_BORROWED: 'Livre emprunté avec succès !',
    BOOK_RESERVED: 'Livre réservé avec succès !',
    LOGIN_SUCCESS: 'Connexion réussie !',
    ADMIN_ADDED: 'Administrateur ajouté avec succès !',
    ADMIN_UPDATED: 'Administrateur modifié avec succès !',
    ADMIN_DELETED: 'Administrateur supprimé avec succès !'
  },
  ERROR: {
    NETWORK: 'Erreur de connexion réseau',
    UNAUTHORIZED: 'Accès non autorisé',
    NOT_FOUND: 'Élément non trouvé',
    SERVER_ERROR: 'Erreur du serveur',
    FORM_INVALID: 'Veuillez corriger les erreurs du formulaire',
    LOGIN_FAILED: 'Identifiants incorrects',
    GENERIC: 'Une erreur est survenue'
  }
};

// Configuration des routes
export const ROUTES = {
  HOME: '/',
  LIBRARY: '/library',
  BOOK: '/book',
  LOGIN: '/login',
  ADMIN: '/admin'
};

// Rôles utilisateur
export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user'
};

// Tailles d'écran (breakpoints Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Configuration de pagination par défaut
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 12,
  ADMIN_LIMIT: 10
};

// Délais de debounce (en ms)
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 150
};

// Formats de fichiers acceptés
export const ACCEPTED_FILE_FORMATS = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// Tailles maximales de fichiers (en bytes)
export const MAX_FILE_SIZES = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024 // 10MB
};