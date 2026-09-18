import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import { destinations } from '../../data/destinations';
import { reviewsAPI } from '../../services/api';
import './Home.css';

const PlannerIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <rect x="10" y="14" width="44" height="36" rx="8" fill="none" stroke="currentColor" strokeWidth="2.8"/>
    <path d="M22 22V10M42 22V10M10 28H54" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
    <path d="M22 36h5l4-8 6 16 5-8h4" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WishlistIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M32 48s-16-9.3-20.5-17.8C8.4 24.1 13.5 14 22.6 14c5.1 0 7.9 2.9 9.4 5.1 1.5-2.2 4.3-5.1 9.4-5.1 9.1 0 14.2 10.1 11.1 16.2C48 38.7 32 48 32 48Z" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 30h16M32 22v16" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
  </svg>
);

const ReviewIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M18 22.5c0-5.2 4.3-9.5 9.5-9.5h9c5.2 0 9.5 4.3 9.5 9.5v12.5c0 5.2-4.3 9.5-9.5 9.5h-6.6L22 49l1.7-7.4A9.3 9.3 0 0 1 18 32.6V22.5Z" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round"/>
    <path d="m26 28 4 4 8-10" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BudgetIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M20 22c0-5.5 4.5-10 10-10h4c5.5 0 10 4.5 10 10v1.5c0 6.2-4.1 11.7-10 13.9V40a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2.6c-5.9-2.2-10-7.7-10-13.9V22Z" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round"/>
    <path d="M26 48h12" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
    <path d="M32 18v24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
  </svg>
);

const BeachIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M8 42c8-4 16-8 24-8s16 4 24 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M10 34c5 2 11 4 18 4s13-2 18-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M20 22c4-4 7-6 12-6 6 0 10 3 12 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const MountainIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M10 46 26 20l8 12 8-12 12 26H10Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M26 20l6 9 8-12 12 26" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
  </svg>
);

const HeritageIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M12 46h40M16 46V24l16-10 16 10v22M24 46V32h16v14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M28 22h8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const AdventureIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M30 16 18 48l14-8 14 8-12-32Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M32 24v12M20 36h24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const Home = () => {
  const featured = destinations.filter((d) => d.isFeatured);
  const [topReviews, setTopReviews] = useState([]);

  useEffect(() => {
    reviewsAPI.getAll().then((response) => setTopReviews(response.data.reviews.slice(0, 3))).catch(() => {});
  }, []);

  const features = [
    { icon: <PlannerIcon />, title: 'Smart Trip Planner', desc: 'Build day-by-day itineraries with budget tracking and packing lists — all in one dashboard.' },
    { icon: <WishlistIcon />, title: 'Wishlist & Discover', desc: 'Save your dream destinations and get personalized recommendations based on your travel style.' },
    { icon: <ReviewIcon />, title: 'Real Reviews', desc: 'Read honest reviews from fellow travelers. No filters, just authentic experiences.' },
    { icon: <BudgetIcon />, title: 'Budget Optimizer', desc: 'Track spending across categories and get smart suggestions to maximize your travel budget.' },
  ];

  const travelStyles = [
    { name: 'Beach breaks', query: 'Beach', icon: <BeachIcon />, desc: 'Sun, sand and slow days', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80' },
    { name: 'Mountain escapes', query: 'Nature', icon: <MountainIcon />, desc: 'Cool air and wide views', img: 'https://images.unsplash.com/photo-1626621331169-5f34be280ed9?w=400&q=80' },
    { name: 'Heritage trails', query: 'History', icon: <HeritageIcon />, desc: 'Forts, food and old cities', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80' },
    { name: 'Adventure trips', query: 'Adventure', icon: <AdventureIcon />, desc: 'For weekends with a story', img: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=400&q=80' },
  ];

  return (
    <div className="home">
      <Hero />

      {/* Features */}
      <section className="section-padding home__features">
        <div className="container">
          <div className="section-head text-center">
            <div className="badge badge-primary">Why Voyago</div>
            <h2 style={{ marginTop: '0.75rem' }}>Everything you need to travel <span className="text-gradient">smarter</span></h2>
            <p>From inspiration to booking, we've got every step of your journey covered.</p>
          </div>
          <div className="grid-4 home__features-grid" style={{ marginTop: '3rem' }}>
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="section-padding">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="badge badge-warm">Editor's Picks</div>
              <h2 style={{ marginTop: '0.75rem' }}>Featured <span className="text-gradient">Destinations</span></h2>
              <p>Handpicked for the most unforgettable travel experiences.</p>
            </div>
            <Link to="/explore" className="view-all-link">View All →</Link>
          </div>
          <div className="grid-4" style={{ marginTop: '2.5rem' }}>
            {featured.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* Explore by travel style */}
      <section className="section-padding home__continents">
        <div className="container">
          <div className="section-head text-center">
            <div className="badge badge-success">Explore India</div>
            <h2 style={{ marginTop: '0.75rem' }}>Pick a trip by <span className="text-gradient">travel style</span></h2>
          </div>
          <div className="home__continent-grid" style={{ marginTop: '2.5rem' }}>
            {travelStyles.map((c) => (
              <Link
                key={c.name}
                to={`/explore?tag=${c.query}`}
                id={`travel-style-${c.query.toLowerCase()}`}
                className="continent-card"
              >
                <img src={c.img} alt={c.name} loading="lazy" />
                <div className="continent-card__overlay" />
                <div className="continent-card__info">
                  <span className="continent-card__icon">{c.icon}</span>
                  <h3>{c.name}</h3>
                  <p>{c.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-padding">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="badge badge-primary">Reviews</div>
              <h2 style={{ marginTop: '0.75rem' }}>What travelers <span className="text-gradient">are saying</span></h2>
            </div>
            <Link to="/reviews" className="view-all-link">View All →</Link>
          </div>
          <div className="grid-3" style={{ marginTop: '2.5rem' }}>
            {topReviews.map((r) => <ReviewCard key={r._id} review={r} />)}
          </div>
          {topReviews.length === 0 && <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>No community reviews yet. Be the first to share your experience.</p>}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="home__cta">
            <div className="home__cta-bg" />
            <h2>Ready to start your next adventure?</h2>
            <p>Join 50,000+ travelers who plan their dream trips with Voyago.</p>
            <div className="home__cta-btns">
              <Link to="/register" id="cta-register-btn" className="btn btn--primary btn--lg">Start for Free →</Link>
              <Link to="/explore" id="cta-explore-btn" className="btn btn--ghost btn--lg">Explore Destinations</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
