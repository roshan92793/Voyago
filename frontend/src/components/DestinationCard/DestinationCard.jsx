import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks';
import { getStars, formatCurrency, truncate } from '../../utils';
import './DestinationCard.css';

const DestinationCard = ({ destination, className = '' }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(destination.id);
  const { full, half, empty } = getStars(destination.rating);

  return (
    <article className={`dest-card ${className}`} id={`dest-card-${destination.id}`}>
      {/* Image */}
      <div className="dest-card__img-wrap">
        <img
          src={destination.image}
          alt={destination.name}
          className="dest-card__img"
          loading="lazy"
        />
        <div className="dest-card__overlay" />

        {/* Wishlist */}
        <button
          id={`wishlist-btn-${destination.id}`}
          className={`dest-card__wishlist ${wishlisted ? 'dest-card__wishlist--active' : ''}`}
          onClick={(e) => { e.preventDefault(); toggleWishlist(destination.id); }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlisted ? '❤️' : '🤍'}
        </button>

        {/* Tags */}
        <div className="dest-card__tags">
          {destination.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="dest-card__tag">{tag}</span>
          ))}
        </div>

        {/* Difficulty */}
        <div className={`dest-card__difficulty dest-card__difficulty--${destination.difficulty?.toLowerCase()}`}>
          {destination.difficulty}
        </div>
      </div>

      {/* Body */}
      <div className="dest-card__body">
        <div className="dest-card__header">
          <div>
            <h3 className="dest-card__name">{destination.name}</h3>
            <p className="dest-card__location">📍 {destination.country}</p>
          </div>
          <div className="dest-card__price">
            <span className="dest-card__price-from">from</span>
            <span className="dest-card__price-val">{formatCurrency(destination.price)}</span>
          </div>
        </div>

        <p className="dest-card__desc">{truncate(destination.description, 90)}</p>

        {/* Rating */}
        <div className="dest-card__rating">
          <div className="stars">
            {'★'.repeat(full)}
            {half ? '½' : ''}
            {'☆'.repeat(empty)}
          </div>
          <span className="dest-card__rating-val">{destination.rating}</span>
          <span className="dest-card__rating-count">({destination.reviews.toLocaleString()})</span>
        </div>

        <div className="dest-card__meta">
          <span>🗓 {destination.duration}</span>
          <span>🌤 {destination.bestTime}</span>
        </div>

        <Link
          to={`/destination/${destination.id}`}
          id={`dest-view-btn-${destination.id}`}
          className="dest-card__cta"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
};

export default DestinationCard;
