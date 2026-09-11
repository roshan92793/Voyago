import { useEffect, useState } from 'react';
import { destinations } from '../../data/destinations';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import { reviewsAPI } from '../../services/api';
import './Reviews.css';

const Reviews = () => {
  const [filter, setFilter] = useState('all');
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    reviewsAPI.getAll()
      .then((response) => setAllReviews(response.data.reviews))
      .catch(() => setError('Unable to load reviews. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const destMap = Object.fromEntries(destinations.map((d) => [d.id, d.name]));

  const filtered = filter === 'all'
    ? allReviews
    : allReviews.filter((r) => String(r.destinationKey) === filter);

  const avgRating = allReviews.length
    ? (allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length).toFixed(1)
    : '—';

  return (
    <div className="reviews section-padding" style={{ paddingTop: '7rem' }}>
      <div className="container">
        {/* Header */}
        <div className="reviews__header">
          <div className="page-header">
            <h1>Traveler <span className="text-gradient">Reviews</span></h1>
          <p>Real experiences shared by the Voyago community.</p>
          </div>
          <div className="reviews__stats">
            <div className="reviews__stat">
              <span className="reviews__stat-val">{avgRating}★</span>
              <span>Avg Rating</span>
            </div>
            <div className="reviews__stat">
              <span className="reviews__stat-val">{allReviews.length}</span>
              <span>Total Reviews</span>
            </div>
          </div>
        </div>

        {/* Destination filter */}
        <div className="reviews__filter">
          <button
            id="review-filter-all"
            className={`filter-pill ${filter === 'all' ? 'filter-pill--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Destinations
          </button>
          {destinations.map((d) => (
            <button
              key={d.id}
              id={`review-filter-${d.id}`}
              className={`filter-pill ${filter === String(d.id) ? 'filter-pill--active' : ''}`}
              onClick={() => setFilter(String(d.id))}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {error && <div className="auth__error" role="alert">{error}</div>}
        {loading && <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>Loading reviews…</p>}
        {!loading && <div className="grid-3" style={{ marginTop: '2rem' }}>
          {filtered.map((r) => (
            <div key={r._id}>
              <div className="reviews__dest-label">📍 {destMap[r.destinationKey] || r.destination?.name || 'Destination'}</div>
              <ReviewCard review={r} />
            </div>
          ))}
        </div>}

        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state__icon">⭐</div>
            <h2>No reviews yet</h2>
            <p>Be the first to review this destination!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
