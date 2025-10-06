import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLibraryBackground } from '../utils/libraryBackgrounds';
import ImageLightbox from './ImageLightbox';

const NewBooksCarousel = ({ books = [], autoInterval = 4000 }) => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!books || books.length === 0) return;

    const start = () => {
      timerRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % books.length);
      }, autoInterval);
    };

    if (!isHovered) start();

    return () => clearInterval(timerRef.current);
  }, [books, autoInterval, isHovered]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const next = (e) => {
    e && e.preventDefault();
    setIndex((i) => (i + 1) % books.length);
  };

  if (!books || books.length === 0) return null;

  const book = books[index];
  const backgroundUrl = index === 0
    ? 'https://cdn.paris.fr/paris/2023/08/29/huge-bccf1b019a55e1e21c17371dd1a6482a.jpg'
    : index === 1
      ? 'https://img.lemde.fr/2024/08/29/446/0/1217/608/1342/671/60/0/76939b3_347143-3387184.jpg'
      : index === 3
        ? 'https://images.lecho.be/view?iid=dc:78610730&context=ONLINE&ratio=16/9&width=1280&u=1491223800000'
        : getLibraryBackground(book.libraryId || 1);

  return (
    <div
      className="relative rounded-lg overflow-hidden"
      onMouseEnter={() => { setIsHovered(true); clearInterval(timerRef.current); }}
      onMouseLeave={() => { setIsHovered(false); }}
      style={{ minHeight: 340 }}
    >
      {/* Background library image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content - clickable area links to book detail */}
      <Link to={`/book/${book.id || ''}`} aria-label={`Voir ${book.title}`} className="relative z-10 container mx-auto px-4 py-8 block">
        <div className="flex items-center justify-between cursor-pointer">
          <div className="w-3/5 text-white pr-6">
            <h3 className="text-3xl md:text-4xl font-bold mb-2">{book.title}</h3>
            <p className="text-base md:text-lg text-gray-200 mb-2">par {book.author}</p>
            {book.libraryName && (
              <p className="text-sm text-primary-100">📍 {book.libraryName}</p>
            )}
            {book.description && (
              <p className="mt-4 text-sm md:text-base text-gray-200 line-clamp-4">{book.description}</p>
            )}
          </div>

          <div className="w-2/5 flex items-center justify-end">
            <div
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); setLightboxOpen(true); }}
              role="button"
              tabIndex={0}
              className="w-48 h-64 bg-gray-100 rounded overflow-hidden shadow-lg transform -translate-x-2 rotate-6 hover:translate-x-0 hover:rotate-2 hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer origin-center"
            >
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">📖</div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Controls */}
      <button
        aria-label="Suivant"
        onClick={next}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 text-gray-800 rounded-full p-3 hover:bg-opacity-100 shadow-lg"
      >
        ▶
      </button>

      {/* Pager dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {books.map((b, i) => (
          <button
            key={b.id}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
            aria-label={`Aller à ${i + 1}`}
          />
        ))}
      </div>
      {lightboxOpen && book.coverImage && (
        <ImageLightbox src={book.coverImage} alt={book.title} onClose={() => setLightboxOpen(false)} />
      )}
    </div>
  );
};

export default NewBooksCarousel;
