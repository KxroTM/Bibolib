import React, { useEffect, useRef, useState } from 'react';

const ImageLightbox = ({ src, alt = '', onClose }) => {
  const [dragX, setDragX] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onMouseDown = (e) => {
    dragging.current = true;
    startX.current = e.clientX - dragX;
    e.preventDefault();
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    setDragX(e.clientX - startX.current);
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  const onTouchStart = (e) => {
    dragging.current = true;
    startX.current = e.touches[0].clientX - dragX;
  };

  const onTouchMove = (e) => {
    if (!dragging.current) return;
    setDragX(e.touches[0].clientX - startX.current);
  };

  const onTouchEnd = () => {
    dragging.current = false;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseLeave={onMouseUp}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative max-w-4xl max-h-[80vh] w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-60 text-white bg-black bg-opacity-40 rounded-full p-2"
          aria-label="Fermer"
        >
          ✕
        </button>

        <div
          className="overflow-hidden bg-black rounded"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            style={{ transform: `translateX(${dragX}px)`, transition: dragging.current ? 'none' : 'transform 200ms ease' }}
            className="w-full h-auto max-h-[80vh] object-contain select-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;
