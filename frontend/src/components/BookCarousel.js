import React, { useState, useEffect, useRef } from 'react';
import BookCard from './BookCard';

const BookCarousel = ({ books, title, subtitle, speed = 40 }) => {
  const scrollRef = useRef(null);
  const innerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const sc = scrollRef.current;
    const inner = innerRef.current;
    if (!sc || !inner || books.length === 0) return;

    let running = true;

    const step = (ts) => {
      if (!running) return;
      if (!lastTsRef.current) lastTsRef.current = ts;
      const delta = ts - lastTsRef.current;
      lastTsRef.current = ts;

      const singleSetWidth = inner.scrollWidth / 2;

      if (!isHoveredRef.current) {
        const distance = (speed * delta) / 1000; // pixels per ms
        offsetRef.current += distance;
        if (offsetRef.current >= singleSetWidth) {
          offsetRef.current -= singleSetWidth;
        }
        inner.style.transform = `translateX(${-offsetRef.current}px)`;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
      // keep offsetRef.current so resume happens from the same place
    };
  }, [books, speed]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  };

  if (!books || books.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          {subtitle && (
            <p className="text-gray-600">{subtitle}</p>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-gray-800"
            aria-label="Défiler vers la gauche"
          >
            ←
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-gray-800"
            aria-label="Défiler vers la droite"
          >
            →
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="overflow-hidden pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          onMouseEnter={() => {
            setIsHovered(true);
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            isHoveredRef.current = false;
          }}
        >
          <div ref={innerRef} className="flex space-x-6 will-change-transform">
            {[...books, ...books].map((book, idx) => (
              <div key={`${book.id}-${idx}`} className="flex-none w-80">
                <BookCard book={book} showLibrary={true} />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient de fondu sur les côtés */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
      </div>


    </div>
  );
};

export default BookCarousel;
