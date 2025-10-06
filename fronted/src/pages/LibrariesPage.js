import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/api';
import LibraryCard from '../components/LibraryCard';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const LibrariesPage = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  // Filtres
  const [selectedArrondissement, setSelectedArrondissement] = useState('');
  const [arrondissements, setArrondissements] = useState([]);

  useEffect(() => {
    loadLibraries();
    loadArrondissements();
  }, [currentPage, selectedArrondissement]);

  const loadLibraries = async () => {
    try {
      setLoading(true);
      const response = await libraryService.getAll({
        page: currentPage,
        limit: itemsPerPage,
        arrondissement: selectedArrondissement
      });
      
      setLibraries(response.data.libraries);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erreur lors du chargement des bibliothèques:', error);
      toast.error('Erreur lors du chargement des bibliothèques');
    } finally {
      setLoading(false);
    }
  };

  const loadArrondissements = async () => {
    try {
      const response = await libraryService.getArrondissements();
      setArrondissements(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des arrondissements:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArrondissementFilter = (arrondissement) => {
    setSelectedArrondissement(arrondissement);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          📚 Bibliothèques de Paris
        </h1>
        <p className="text-xl text-gray-600">
          Découvrez toutes les bibliothèques parisiennes et leurs collections
        </p>
      </div>

      {/* Filtres par arrondissement */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Filtrer par arrondissement :</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleArrondissementFilter('')}
            className={`px-4 py-2 text-sm rounded-full transition-colors font-medium ${
              selectedArrondissement === ''
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tous les arrondissements
          </button>
          {arrondissements.map((arr) => (
            <button
              key={arr}
              onClick={() => handleArrondissementFilter(arr)}
              className={`px-4 py-2 text-sm rounded-full transition-colors font-medium ${
                selectedArrondissement === arr
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {arr}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des bibliothèques */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {selectedArrondissement ? `Bibliothèques du ${selectedArrondissement}` : 'Toutes les bibliothèques'}
          </h2>
          <p className="text-gray-600">
            {libraries.length} bibliothèque{libraries.length > 1 ? 's' : ''} trouvée{libraries.length > 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader size="large" />
            <p className="mt-4 text-gray-600">Chargement des bibliothèques...</p>
          </div>
        ) : libraries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraries.map((library) => (
                <LibraryCard key={library.id} library={library} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune bibliothèque trouvée</h3>
            <p className="text-gray-600">
              {selectedArrondissement 
                ? `Aucune bibliothèque disponible dans le ${selectedArrondissement}.`
                : 'Aucune bibliothèque disponible pour le moment.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrariesPage;