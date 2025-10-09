import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <div 
        className="relative h-96 mb-12 rounded-lg overflow-hidden"
        style={{
          backgroundImage: 'url(https://www.pariszigzag.fr/wp-content/uploads/2021/12/Site-Richelieu.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
          <div>
            <h1 className="text-5xl font-bold mb-4">Bibliothèque numérique Paris</h1>
            <p className="text-xl mb-8">Découvrez les trésors des bibliothèques parisiennes</p>
            <Link 
              to="/libraries" 
              className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white font-medium rounded-lg hover:bg-opacity-30 transition-all duration-200"
            >
              📚 Voir toutes les bibliothèques
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Bienvenue sur Bibliothèque numérique</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explorez les collections des bibliothèques parisiennes, réservez vos livres préférés 
            et découvrez de nouveaux ouvrages dans un écosystème numérique moderne.
          </p>
        </div>
      </div>
    </>
  );
};

export default HomePage;