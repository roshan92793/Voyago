import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import './Hero.css';

const Hero = () => {
  const stats = [
    { value: '500+', label: 'Destinations' },
    { value: '50K+', label: 'Happy Travelers' },
    { value: '4.9★', label: 'Average Rating' },
  ];

  return (
    <section className="hero" id="hero">
      <div className="hero__bg">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
        <div className="hero__grid" />
      </div>

      <div className="container hero__content">
        {/* Badge */}
        <div className="hero__badge animate-fade-in">
          <span className="hero__badge-dot" />
          ✈️ Your ultimate travel companion
        </div>

        {/* Heading */}
        <h1 className="hero__heading animate-fade-in">
          Discover the World's<br />
          <span className="text-gradient">Most Breathtaking</span><br />
          Destinations
        </h1>

        <p className="hero__sub animate-fade-in">
          Plan your perfect trip with curated destinations, real traveler reviews,
          and intelligent trip planning tools — all in one place.
        </p>

        {/* Search */}
        <div className="hero__search animate-fade-in">
          <SearchBar variant="hero" placeholder="Search destinations, countries, experiences..." />
        </div>

        {/* Quick tags */}
        <div className="hero__tags animate-fade-in">
          {['🏖️ Beaches', '🏔️ Mountains', '🌆 Cities', '🌿 Nature', '🏛️ Culture', '💎 Luxury'].map((tag) => (
            <Link key={tag} to={`/explore?q=${encodeURIComponent(tag.split(' ')[1])}`} className="hero__tag">
              {tag}
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="hero__stats animate-fade-in">
          {stats.map(({ value, label }) => (
            <div key={label} className="hero__stat">
              <span className="hero__stat-value">{value}</span>
              <span className="hero__stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll">
        <div className="hero__scroll-dot" />
      </div>
    </section>
  );
};

export default Hero;
