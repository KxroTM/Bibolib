// Validateurs pour les formulaires

export const validateEmail = (email) => {
  if (!email) {
    return 'L\'email est requis';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Format d\'email invalide';
  }
  
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Le mot de passe est requis';
  }
  
  if (password.length < 6) {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }
  
  return null;
};

export const validateRequired = (value, fieldName = 'Ce champ') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} est requis`;
  }
  return null;
};

export const validateYear = (year) => {
  if (!year) return null;
  
  const currentYear = new Date().getFullYear();
  const numYear = parseInt(year);
  
  if (isNaN(numYear)) {
    return 'L\'année doit être un nombre';
  }
  
  if (numYear < 1000 || numYear > currentYear) {
    return `L'année doit être entre 1000 et ${currentYear}`;
  }
  
  return null;
};

export const validateISBN = (isbn) => {
  if (!isbn) return null;
  
  // Supprime les tirets et espaces
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  
  // Vérifie le format ISBN-10 ou ISBN-13
  if (cleanISBN.length !== 10 && cleanISBN.length !== 13) {
    return 'L\'ISBN doit contenir 10 ou 13 chiffres';
  }
  
  // Vérifie que ce sont bien des chiffres (sauf le dernier qui peut être X pour ISBN-10)
  const isValidFormat = /^\d{9}[\dX]$/.test(cleanISBN) || /^\d{13}$/.test(cleanISBN);
  
  if (!isValidFormat) {
    return 'Format d\'ISBN invalide';
  }
  
  return null;
};

export const validateURL = (url) => {
  if (!url) return null;
  
  try {
    new URL(url);
    return null;
  } catch {
    return 'URL invalide';
  }
};

// Fonction générique de validation de formulaire
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Arrête à la première erreur pour ce champ
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};