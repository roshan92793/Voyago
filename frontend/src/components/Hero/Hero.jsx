import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import './Hero.css';

const Hero = () => (
  <section className="hero" id="hero">
    <div className="hero__image" aria-hidden="true" />
    <div className="hero__overlay" aria-hidden="true" />
    <div className="container hero__content">
      <p className="hero__eyebrow">INDIA HOLIDAYS, MADE SIMPLE</p>
      <h1 className="hero__heading">Find a trip worth looking forward to.</h1>
      <p className="hero__sub">Discover verified destinations, practical budgets, and ideas for your next break.</p>
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
