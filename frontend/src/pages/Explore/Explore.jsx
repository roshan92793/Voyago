import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import { destinations, continents, tags } from '../../data/destinations';
import './Explore.css';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery]       = useState(searchParams.get('q') || '');
  const [continent, setContinent] = useState(searchParams.get('continent') || 'All');
  const [activeTag, setTag]     = useState(searchParams.get('tag') || 'All');
  const [sortBy, setSort]       = useState('rating');
  const [priceMax, setPriceMax] = useState(50000);

  const filtered = useMemo(() => {
    let list = [...destinations];
    if (query)         list = list.filter(d => `${d.name} ${d.country} ${d.description}`.toLowerCase().includes(query.toLowerCase()));
    if (continent !== 'All') list = list.filter(d => d.continent === continent);
    if (activeTag !== 'All') list = list.filter(d => d.tags.includes(activeTag));
    list = list.filter(d => d.price <= priceMax);
    if (sortBy === 'rating')  list.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'reviews')    list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [query, continent, activeTag, sortBy, priceMax]);

  return (
    <div className="explore">
      {/* Header */}
      <div className="explore__header">
        <div className="explore__header-bg" />
        <div className="container explore__header-content">
          <h1>Explore <span className="text-gradient">Destinations</span></h1>
          <p>Discover {destinations.length} handpicked destinations across India.</p>
          <SearchBar onSearch={setQuery} placeholder="Search destinations..." />
        </div>
      </div>

      <div className="container explore__body">
        {/* Filters */}
        <aside className="explore__sidebar">
          <div className="filter-section">
            <h4>Continent</h4>
            <div className="filter-pills">
              {continents.map((c) => (
                <button
                  key={c}
                  id={`continent-filter-${c.toLowerCase()}`}
                  className={`filter-pill ${continent === c ? 'filter-pill--active' : ''}`}
                  onClick={() => setContinent(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Category</h4>
            <div className="filter-pills">
              {tags.map((t) => (
                <button
                  key={t}
                  id={`tag-filter-${t.toLowerCase()}`}
                  className={`filter-pill ${activeTag === t ? 'filter-pill--active' : ''}`}
                  onClick={() => setTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Max Budget: <strong style={{ color: 'var(--primary-light)' }}>₹{priceMax.toLocaleString('en-IN')}</strong></h4>
            <input
              id="price-range-filter"
              type="range"
              min={5000} max={50000} step={1000}
              value={priceMax}
              onChange={(e) => setPriceMax(+e.target.value)}
              className="price-range"
            />
            <div className="price-range-labels"><span>₹5,000</span><span>₹50,000</span></div>
          </div>

          <button
            id="reset-filters-btn"
            className="reset-btn"
            onClick={() => { setQuery(''); setContinent('All'); setTag('All'); setSort('rating'); setPriceMax(50000); }}
          >
            Reset Filters
          </button>
        </aside>

        {/* Results */}
        <div className="explore__results">
          <div className="explore__results-header">
            <span className="explore__count">{filtered.length} destination{filtered.length !== 1 ? 's' : ''}</span>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="explore__empty">
              <span>🌐</span>
              <h3>No destinations found</h3>
              <p>Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="explore__grid">
              {filtered.map((d) => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
