const FALLBACK_PLACE_IMAGE = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&q=80';

const resolvePlaceImage = (place) => {
  const candidates = [];

  if (Array.isArray(place?.images)) {
    for (const item of place.images) {
      if (typeof item === 'string' && item.trim()) candidates.push(item.trim());
      else if (item && typeof item === 'object') {
        if (typeof item.url === 'string' && item.url.trim()) candidates.push(item.url.trim());
        if (typeof item.image === 'string' && item.image.trim()) candidates.push(item.image.trim());
      }
    }
  }

  if (typeof place?.image === 'string' && place.image.trim()) candidates.push(place.image.trim());
  if (typeof place?.url === 'string' && place.url.trim()) candidates.push(place.url.trim());

  const cleanImage = candidates.find((url) => /^https?:\/\//i.test(url));
  return cleanImage || FALLBACK_PLACE_IMAGE;
};

const TouristPlaceCard = ({ place }) => {
  const image = resolvePlaceImage(place);

  return (
    <article className="tourist-place-card">
      <div className="tourist-place-card__image-wrap">
        <img
          src={image}
          alt={place?.name || 'Tourist place'}
          className="tourist-place-card__image"
          loading="lazy"
          onError={(event) => {
            if (event.currentTarget.src !== FALLBACK_PLACE_IMAGE) {
              event.currentTarget.src = FALLBACK_PLACE_IMAGE;
            }
          }}
        />
      </div>
      <div className="tourist-place-card__content">
        <div className="tourist-place-card__header">
          <h3>{place?.name || 'Popular attraction'}</h3>
          <span>{place?.category || 'Must-visit'}</span>
        </div>
        <p className="tourist-place-card__location">📍 {place?.location || 'Location'}</p>
        <p className="tourist-place-card__description">{place?.description || 'Discover this memorable place and enjoy the local atmosphere.'}</p>
        <div className="tourist-place-card__footer">
          <small>{place?.bestTime || 'Best during the day'}</small>
          <button type="button" className="tourist-place-card__button">Explore</button>
        </div>
      </div>
    </article>
  );
};

export default TouristPlaceCard;
