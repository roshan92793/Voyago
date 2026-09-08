import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks';
import './SearchBar.css';

const SearchBar = ({ placeholder = 'Search destinations, countries...', onSearch, variant = 'default' }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  useDebounce(query, 400);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <form
      className={`search-bar search-bar--${variant}`}
      onSubmit={handleSubmit}
      role="search"
    >
      <div className="search-bar__inner">
        <span className="search-bar__icon" aria-hidden="true">🔍</span>
        <input
          id="main-search-input"
          type="search"
          className="search-bar__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search destinations"
        />
        {query && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <button id="search-submit-btn" type="submit" className="search-bar__btn">
        Explore
      </button>
    </form>
  );
};

export default SearchBar;
