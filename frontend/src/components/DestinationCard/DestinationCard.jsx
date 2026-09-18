import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks';
import './DestinationCard.css';

const DestinationCard = ({ destination, className = '' }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const destinationId = String(destination._id || destination.id || destination.name || 'destination');

  const imageUrl = typeof destination.image === 'string'
    ? destination.image
    : destination.images?.[0]?.url || destination.images?.[0] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80';

  const famousPlaces = Array.isArray(destination.famousPlaces)
    ? destination.famousPlaces.slice(0, 3)
    : (Array.isArray(destination.attractions) ? destination.attractions.slice(0, 3) : []);

  const highlights = Array.isArray(destination.highlights) ? destination.highlights.slice(0, 4) : [];
  const weather = destination.weather || null;
  const wishlisted = isWishlisted(destinationId);

  return (
    <article className={`dest-card ${className}`} id={`dest-card-${destinationId}`}>
      <div className="dest-card__img-wrap">
        <img src={imageUrl} alt={destination.name} className="dest-card__img" loading="lazy" />
        <div className="dest-card__overlay" />

        <button
          id={`wishlist-btn-${destinationId}`}
          className={`dest-card__wishlist ${wishlisted ? 'dest-card__wishlist--active' : ''}`}
          onClick={(e) => { e.preventDefault(); toggleWishlist(destinationId); }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlisted ? '❤️' : '🤍'}
        </button>

        <div className="dest-card__badge">Explore</div>
      </div>

      <div className="dest-card__body">
        <div className="dest-card__header">
          <div>
            <h3 className="dest-card__name">{destination.name}</h3>
            <p className="dest-card__location">📍 {destination.country || 'Destination'}{destination.state ? `, ${destination.state}` : ''}</p>
          </div>
        </div>

        <p className="dest-card__desc">{destination.description || 'Discover this destination through iconic places, local culture, and memorable experiences.'}</p>

        <div className="dest-card__weather">
          {weather ? (
            <>
              <span className="dest-card__weather-temp">{weather.temperature != null ? `${weather.temperature}°C` : 'Weather update'}</span>
              <span className="dest-card__weather-condition">{weather.condition || 'Climate update'}</span>
            </>
          ) : (
            <span className="dest-card__weather-condition">Weather currently unavailable</span>
          )}
        </div>

        <div className="dest-card__highlights">
          {highlights.length ? highlights.map((highlight) => (
            <span key={highlight} className="dest-card__highlight">{highlight}</span>
          )) : <span className="dest-card__highlight">Scenic escapes</span>}
        </div>

        <div className="dest-card__places">
          {famousPlaces.length ? famousPlaces.map((place) => (
            <div key={`${destination.name}-${place.name}`} className="dest-card__place">
              <span className="dest-card__place-dot" />
              <span>{place.name}</span>
            </div>
          )) : <div className="dest-card__place"><span className="dest-card__place-dot" /> <span>Popular viewpoints</span></div>}
        </div>

        <div className="dest-card__actions">
          <Link to={`/destination/${destinationId}`} id={`dest-view-btn-${destinationId}`} className="dest-card__link">
            Explore Destination
          </Link>
          <Link to="/trip-planner" className="dest-card__plan-btn">
            Plan a Trip
          </Link>
        </div>
      </div>
    </article>
  );
};

export default DestinationCard;
