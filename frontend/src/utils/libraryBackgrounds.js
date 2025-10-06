// Images d'arrière-plan pour les bibliothèques
export const libraryBackgroundImages = [
  'https://cdn.paris.fr/paris/2022/01/27/huge-c78b5203a2ee098c9e89bf879723e052.jpg',
  'https://laplumedepoudlard.com/wp-content/uploads/2019/12/40325_livraria_lello_2-1024x574.jpg',
  'https://uploads.lebonbon.fr/source/2019/january/erct5cm083_1_950.jpg'
];

// Fonction pour obtenir une image d'arrière-plan basée sur l'ID de la bibliothèque
export const getLibraryBackground = (libraryId) => {
  const index = libraryId % libraryBackgroundImages.length;
  return libraryBackgroundImages[index];
};