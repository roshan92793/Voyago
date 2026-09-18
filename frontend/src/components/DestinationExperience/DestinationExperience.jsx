import { Link } from 'react-router-dom';
import WeatherCard from '../WeatherCard/WeatherCard';
import TouristPlaceCard from '../TouristPlaceCard/TouristPlaceCard';

const normalizeFamousPlaces = (collection = []) =>
  Array.isArray(collection)
    ? collection.filter((place) => place && (place.name || place.description)).slice(0, 8)
    : [];

const DestinationExperience = ({ destination }) => {
  if (!destination) return null;

  const famousPlaces = normalizeFamousPlaces(destination.famousPlaces || destination.attractions || []);
  const heroImage =
    Array.isArray(destination.images) && destination.images.length
      ? destination.images[0]
      : destination.image;

  return (
    <div className="destination-experience">
      <div className="destination-experience__hero">
        <img src={heroImage} alt={destination.name} className="destination-experience__hero-image" />
        <div className="destination-experience__hero-overlay" />
        <div className="container destination-experience__hero-content">
          <div className="destination-experience__eyebrow">Explore destination</div>
          <h1>{destination.name}</h1>
          <p className="destination-experience__location">{destination.country || 'Destination'}{destination.state ? `, ${destination.state}` : ''}</p>
          <p className="destination-experience__description">{destination.description}</p>
          <div className="destination-experience__actions">
            <Link to="/trip-planner" className="btn btn--primary btn--lg">Plan a Trip</Link>
          </div>
        </div>
      </div>

      <div className="container destination-experience__content">
        <section className="destination-experience__section destination-experience__section--weather">
          <WeatherCard weather={destination.weather} destinationName={destination.name} />
        </section>

        <section className="destination-experience__section">
          <div className="section-header">
            <h2>Highlights</h2>
          </div>
          <div className="destination-experience__highlights">
            {(destination.highlights || []).slice(0, 6).map((highlight) => (
              <span key={highlight} className="highlight-pill">✨ {highlight}</span>
            ))}
          </div>
        </section>

        <section className="destination-experience__section">
          <div className="section-header">
            <h2>Famous places to explore</h2>
          </div>
          <div className="destination-experience__places-grid">
            {famousPlaces.map((place) => (
              <TouristPlaceCard key={`${destination.name}-${place.name}`} place={place} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DestinationExperience;
