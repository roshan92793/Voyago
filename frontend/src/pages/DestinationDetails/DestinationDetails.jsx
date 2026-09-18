import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import DestinationExperience from '../../components/DestinationExperience/DestinationExperience';
import { useWishlist } from '../../hooks';
import { useAuth } from '../../context/AuthContext';
import { destinationsAPI, reviewsAPI } from '../../services/api';
import { destinations as fallbackDestinations } from '../../data/destinations';
import { getStars } from '../../utils';
import Error from '../../components/Error/Error';
import '../../components/DestinationExperience/DestinationExperience.css';
import './DestinationDetails.css';

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

const isUsableImageUrl = (value) => typeof value === 'string' && /^https?:\/\//i.test(value) && !/example\.com|placehold|dummy/i.test(value);

const normalizeDestination = (item) => {
  const rawImages = Array.isArray(item.images)
    ? item.images.filter((image) => isUsableImageUrl(typeof image === 'string' ? image : image?.url))
    : [];
  const normalizedImages = rawImages.map(normalizeImage).filter(Boolean);
  const primaryImage = typeof item.image === 'string' && isUsableImageUrl(item.image)
    ? item.image
    : normalizedImages[0]?.url || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80';

  return {
    ...item,
    id: item._id || item.id,
    _id: item._id || item.id,
    name: item.name || 'Destination',
    country: item.country || 'India',
    state: item.state || item.location || '',
    continent: item.continent || 'Asia',
    description: item.description || 'Discover this destination.',
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
  };
};

const DestinationDetails = () => {
  const { id } = useParams();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [destination, setDestination] = useState(null);
  const [destReviews, setDestReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadReviews = async (destinationId) => {
    try {
      const response = await reviewsAPI.getByDestination(destinationId);
      setDestReviews(response.data.reviews || []);
    } catch {
      setReviewError('Unable to load reviews. Please try again later.');
    }
  };

  useEffect(() => {
    const loadDestination = async () => {
      try {
        const response = await destinationsAPI.getById(id);
        const normalized = normalizeDestination(response.data.destination || response.data);
        setDestination(normalized);
        await loadReviews(normalized._id || id);

        if (!normalized.images?.length) {
          const imagesResponse = await destinationsAPI.fetchImages(normalized._id || id);
          if (imagesResponse.data?.images?.length) {
            setDestination((prev) => prev ? { ...prev, images: imagesResponse.data.images, image: imagesResponse.data.images[0] } : prev);
          }
        }
      } catch {
        const fallback = fallbackDestinations.find((item) => String(item.id) === String(id));
        if (fallback) {
          setDestination(normalizeDestination(fallback));
          await loadReviews(String(fallback.id));
        } else {
          setDestination(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDestination();
  }, [id]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewError('');
    setSubmittingReview(true);
    try {
      await reviewsAPI.create({ destinationKey: String(destination._id || id), rating: Number(reviewForm.rating), comment: reviewForm.comment });
      setReviewForm({ rating: 5, comment: '' });
      await loadReviews(destination._id || id);
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Could not submit your review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!loading && !destination) return <Error code="404" title="Destination Not Found" message="This destination doesn't exist." />;

  if (!destination) return null;

  const { full, half, empty } = getStars(destination.rating);
  const wishlisted = isWishlisted(destination.id);
  const destinationId = destination._id || destination.id;

  return (
    <div className="dest-details">
      <DestinationExperience destination={destination} />

      <div className="container dest-details__body">
        <div className="dest-details__main">
          <section className="dest-details__section">
            <h2>Traveler Reviews</h2>
            {isAuthenticated && (
              <form className="dest-details__review-form" onSubmit={handleReviewSubmit}>
                <label htmlFor="review-rating">Your rating</label>
                <select id="review-rating" value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: event.target.value })}>
                  {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} star{rating > 1 ? 's' : ''}</option>)}
                </select>
                <label htmlFor="review-comment">Share your experience</label>
                <textarea id="review-comment" value={reviewForm.comment} onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })} minLength="10" required placeholder={`What did you enjoy about ${destination.name}?`} rows="3" />
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

        <aside className="dest-details__sidebar" style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default DestinationDetails;
