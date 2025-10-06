import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, placeholder = "Rechercher un livre...", className = "" }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce pour optimiser les recherches
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        setIsSearching(true);
        onSearch(query.trim()).finally(() => setIsSearching(false));
      } else {
        onSearch('');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      onSearch(query.trim()).finally(() => setIsSearching(false));
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="input-field pl-10 pr-20"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {isSearching && (
            <div className="mr-8">
              <div className="loader h-4 w-4"></div>
            </div>
          )}
          
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="mr-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <button
            type="submit"
            className="mr-2 px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
          >
            Rechercher
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;