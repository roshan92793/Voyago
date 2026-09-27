import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import './Hero.css';

const Hero = () => (
  <section className="hero" id="hero">
    <div className="hero__image" aria-hidden="true" />
    <div className="hero__overlay" aria-hidden="true" />
    <div className="container hero__content">
      <p className="hero__eyebrow">MAKE ROOM FOR SOMEWHERE NEW</p>
      <h1 className="hero__heading">Explore somewhere new. Plan unforgettable journeys.</h1>
      <p className="hero__sub">Discover destinations, build itineraries, manage your budget, and create trips you’ll remember.</p>
      <div className="hero__actions">
        <Link to="/trip-planner" className="hero__action hero__action--primary">Plan Your Trip <span aria-hidden="true">→</span></Link>
        <Link to="/explore" className="hero__action hero__action--secondary">Explore Destinations</Link>
      </div>
      <div className="hero__search-card">
        <div className="hero__search-label">Where do you want to go?</div>
        <SearchBar variant="hero" placeholder="Search Goa, Jaipur, Manali, Kerala..." />
        <div className="hero__suggestions">
          <span>Popular:</span><Link to="/explore?q=Goa">Goa</Link><Link to="/explore?q=Manali">Manali</Link><Link to="/explore?q=Jaipur">Jaipur</Link><Link to="/explore?q=Kerala">Kerala</Link>
        </div>
      </div>
      <div className="hero__trust"><span>✓ Curated Indian destinations</span><span>✓ Budgets shown in INR</span><span>✓ Community travel reviews</span></div>
    </div>
  </section>
);

export default Hero;
