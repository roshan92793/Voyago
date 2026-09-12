import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { destinations } from '../../data/destinations';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import { useWishlist } from '../../hooks';
import { useAuth } from '../../context/AuthContext';
import { reviewsAPI } from '../../services/api';
import { formatCurrency, getStars } from '../../utils';
import Error from '../../components/Error/Error';
import './DestinationDetails.css';

const DestinationDetails = () => {
  const { id } = useParams();
  const dest = destinations.find((d) => d.id === +id);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [destReviews, setDestReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  if (!dest) return <Error code="404" title="Destination Not Found" message="This destination doesn't exist." />;

  const loadReviews = async () => {
    try {
      const response = await reviewsAPI.getByDestination(dest.id);
      setDestReviews(response.data.reviews);
    } catch {
      setReviewError('Unable to load reviews. Please try again later.');
    }
  };

  useEffect(() => { loadReviews(); }, [id]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewError('');
    setSubmittingReview(true);
    try {
      await reviewsAPI.create({ destinationKey: String(dest.id), rating: Number(reviewForm.rating), comment: reviewForm.comment });
      setReviewForm({ rating: 5, comment: '' });
      await loadReviews();
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Could not submit your review.');
    } finally {
      setSubmittingReview(false);
    }
  };
  const { full, half, empty } = getStars(dest.rating);
  const wishlisted = isWishlisted(dest.id);

  return (
    <div className="dest-details">
      {/* Hero */}
      <div className="dest-details__hero">
        <img src={dest.image} alt={dest.name} className="dest-details__hero-img" />
        <div className="dest-details__hero-overlay" />
        <div className="dest-details__hero-content">
          <div className="container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link> / <Link to="/explore">Explore</Link> / <span>{dest.name}</span>
            </nav>
            <div className="dest-details__tags">
              {dest.tags.map((t) => <span key={t} className="dest-card__tag">{t}</span>)}
            </div>
            <h1 className="dest-details__name">{dest.name}</h1>
            <div className="dest-details__meta">
              <span>📍 {dest.country}</span>
              <div className="stars">{'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}</div>
              <span>{dest.rating} ({dest.reviews.toLocaleString()} reviews)</span>
              <span>🕐 {dest.duration}</span>
              <span>🌤 Best: {dest.bestTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container dest-details__body">
        {/* Main */}
        <div className="dest-details__main">
          {/* About */}
          <section className="dest-details__section">
            <h2>About {dest.name}</h2>
            <p>{dest.description}</p>
          </section>

          {/* Highlights */}
          <section className="dest-details__section">
            <h2>Highlights</h2>
            <div className="dest-details__highlights">
              {dest.highlights.map((h) => (
                <div key={h} className="highlight-chip">✨ {h}</div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="dest-details__section">
            <h2>Traveler Reviews</h2>
            {isAuthenticated && (
              <form className="dest-details__review-form" onSubmit={handleReviewSubmit}>
                <label htmlFor="review-rating">Your rating</label>
                <select id="review-rating" value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: event.target.value })}>
                  {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} star{rating > 1 ? 's' : ''}</option>)}
                </select>
                <label htmlFor="review-comment">Share your experience</label>
                <textarea id="review-comment" value={reviewForm.comment} onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })} minLength="10" required placeholder={`What did you enjoy about ${dest.name}?`} rows="3" />
                {reviewError && <p className="dest-details__review-error" role="alert">{reviewError}</p>}
                <button className="btn btn--primary btn--sm" type="submit" disabled={submittingReview}>{submittingReview ? 'Submitting…' : 'Post review'}</button>
              </form>
            )}
            {!isAuthenticated && <p className="dest-details__review-login">Sign in to share your travel experience.</p>}
            {destReviews.length > 0 ? (
              <div className="dest-details__reviews">
                {destReviews.map((r) => <ReviewCard key={r._id} review={r} />)}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review!</p>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="dest-details__sidebar">
          <div className="dest-details__card">
            <div className="dest-details__price">
              <span className="dest-details__price-from">From</span>
              <span className="dest-details__price-val">{formatCurrency(dest.price)}</span>
              <span className="dest-details__price-dur">per person · {dest.duration}</span>
            </div>

            <div className="dest-details__info-list">
              <div className="dest-details__info-item">
                <span>📍 Location</span><strong>{dest.country}, {dest.continent}</strong>
              </div>
              <div className="dest-details__info-item">
                <span>🎯 Difficulty</span>
                <strong className={`diff diff--${dest.difficulty?.toLowerCase()}`}>{dest.difficulty}</strong>
              </div>
              <div className="dest-details__info-item">
                <span>🌤 Best Season</span><strong>{dest.bestTime}</strong>
              </div>
              <div className="dest-details__info-item">
                <span>⏱ Duration</span><strong>{dest.duration}</strong>
              </div>
            </div>

            <div className="dest-details__actions">
              <Link
                to="/trip-planner"
                id={`plan-trip-btn-${dest.id}`}
                className="btn btn--primary btn--lg"
                style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
              >
                ✈️ Plan This Trip
              </Link>
              <button
                id={`wishlist-detail-btn-${dest.id}`}
                className={`btn btn--${wishlisted ? 'danger' : 'ghost'} btn--lg`}
                style={{ width: '100%' }}
                onClick={() => toggleWishlist(dest.id)}
              >
                {wishlisted ? '❤️ Wishlisted' : '🤍 Add to Wishlist'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DestinationDetails;
