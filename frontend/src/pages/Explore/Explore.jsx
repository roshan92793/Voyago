import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import { destinationsAPI } from '../../services/api';
import { destinations as fallbackDestinations } from '../../data/destinations';
import './Explore.css';

const continents = ['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];
const tags = ['All', 'Beach', 'Adventure', 'Nature', 'Culture', 'History', 'Romantic'];

const normalizeImage = (image) => {
  if (!image) return null;
  if (typeof image === 'string') {
    return { id: image, url: image, thumbnail: image, description: '', photographer: '', photographerUrl: '' };
  }
  if (typeof image?.url === 'string') {
    return {
      id: image.id || image.url,
      url: image.url,
      thumbnail: image.thumbnail || image.url,
      description: image.description || '',
      photographer: image.photographer || '',
      photographerUrl: image.photographerUrl || ''
    };
  }
  return null;
};

const normalizeDestination = (item) => {
  const id = item._id || item.id;
  const normalizedImages = Array.isArray(item.images)
    ? item.images.map(normalizeImage).filter(Boolean)
    : [];
  const primaryImage = typeof item.image === 'string'
    ? item.image
    : normalizedImages[0]?.url || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80';

  return {
    ...item,
    id,
    _id: item._id || id,
    name: item.name || 'Untitled destination',
    country: item.country || 'India',
    state: item.state || item.location || '',
    continent: item.continent || 'Asia',
    description: item.description || 'Explore this beautiful destination.',
    image: primaryImage,
    images: normalizedImages.length ? normalizedImages.map((img) => img.url || img) : (item.image ? [item.image] : []),
    price: item.price ?? item.averageBudget ?? 18000,
    rating: Number(item.rating ?? 4.5),
    reviews: item.reviews ?? item.reviewCount ?? 0,
    tags: item.tags?.length ? item.tags : (item.attractions || []).slice(0, 3),
    difficulty: item.difficulty || 'Easy',
    duration: item.duration || '4 days',
    bestTime: item.bestTime || item.bestTimeToVisit || 'Nov - Feb',
    highlights: item.highlights || item.attractions || [],
    famousPlaces: Array.isArray(item.famousPlaces) ? item.famousPlaces : [],
    weather: item.weather || null,
  };
};

const Explore = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [continent, setContinent] = useState(searchParams.get('continent') || 'All');
  const [activeTag, setTag] = useState(searchParams.get('tag') || 'All');
  const [sortBy, setSort] = useState('rating');
  const [priceMax, setPriceMax] = useState(50000);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const response = await destinationsAPI.getAll();
        const normalized = (response.data.destinations || []).map(normalizeDestination);
        setDestinations(normalized.length ? normalized : fallbackDestinations.map(normalizeDestination));
      } catch {
        setDestinations(fallbackDestinations.map(normalizeDestination));
      } finally {
        setLoading(false);
      }
    };

    const searchDestinations = async (searchText) => {
      try {
        setLoading(true);
        const response = await destinationsAPI.search(searchText);
        const destination = response.data?.destination;
        const fallbackMatches = fallbackDestinations.filter((item) =>
          `${item.name} ${item.country}`.toLowerCase().includes(searchText.toLowerCase())
        );
        setDestinations(destination ? [normalizeDestination(destination)] : fallbackMatches.map(normalizeDestination));
      } catch {
        const fallbackMatches = fallbackDestinations.filter((item) =>
          `${item.name} ${item.country}`.toLowerCase().includes(searchText.toLowerCase())
        );
        setDestinations(fallbackMatches.map(normalizeDestination));
      } finally {
        setLoading(false);
      }
    };

    if (query.trim()) {
      searchDestinations(query.trim());
      return;
    }

    loadDestinations();
  }, [query]);

  const filtered = useMemo(() => {
    let list = [...destinations];
    if (query) list = list.filter((d) => `${d.name} ${d.country} ${d.description}`.toLowerCase().includes(query.toLowerCase()));
    if (continent !== 'All') list = list.filter((d) => d.continent === continent);
    if (activeTag !== 'All') list = list.filter((d) => (d.tags || []).includes(activeTag));
    list = list.filter((d) => (d.price ?? 0) <= priceMax);
    if (sortBy === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'price-asc') list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sortBy === 'price-desc') list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sortBy === 'reviews') list.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
    return list;
  }, [query, continent, activeTag, sortBy, priceMax, destinations]);

  return (
    <div className="explore">
      <div className="explore__header">
        <div className="explore__header-bg" />
        <div className="container explore__header-content">
          <h1>Explore <span className="text-gradient">Destinations</span></h1>
          <p>Discover {destinations.length} handpicked destinations across India.</p>
          <SearchBar onSearch={setQuery} placeholder="Search destinations..." />
        </div>
      </div>

      <div className="container explore__body">
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

          {loading ? (
            <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>Loading destinations…</p>
          ) : filtered.length === 0 ? (
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
