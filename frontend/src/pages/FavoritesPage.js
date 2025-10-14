import React, { useEffect, useState } from 'react';
import { getFavorites } from '../utils/favorites';
import { bookService } from '../services/api';
import Loader from '../components/Loader';
import BookCard from '../components/BookCard';

const FavoritesPage = () => {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const favIds = getFavorites();
        if (!favIds || favIds.length === 0) {
          setBooks([]);
          return;
        }

        // Try to fetch in bulk if API supports multiple ids; fallback to individual
        const fetched = [];
        for (const id of favIds) {
          try {
            const res = await bookService.getById(id);
            if (res && res.data) fetched.push(res.data);
          } catch (e) {
            // ignore missing
          }
        }
        setBooks(fetched);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="text-center py-12"><Loader size="large" /><p className="mt-4 text-gray-600">Chargement des favoris...</p></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mes favoris</h1>

      {books.length === 0 ? (
        <div className="text-center py-12 text-gray-600">Vous n'avez pas encore ajouté de favoris.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map(b => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
