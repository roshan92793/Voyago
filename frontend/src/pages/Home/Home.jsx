import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import { destinations } from '../../data/destinations';
import { reviewsAPI } from '../../services/api';
import './Home.css';

const Home = () => {
  const featured = destinations.filter((d) => d.isFeatured);
  const [topReviews, setTopReviews] = useState([]);

  useEffect(() => {
    reviewsAPI.getAll().then((response) => setTopReviews(response.data.reviews.slice(0, 3))).catch(() => {});
  }, []);

  const features = [
    { icon: '🗺️', title: 'Smart Trip Planner', desc: 'Build day-by-day itineraries with budget tracking and packing lists — all in one dashboard.' },
    { icon: '❤️', title: 'Wishlist & Discover', desc: 'Save your dream destinations and get personalized recommendations based on your travel style.' },
    { icon: '⭐', title: 'Real Reviews', desc: 'Read honest reviews from fellow travelers. No filters, just authentic experiences.' },
    { icon: '💰', title: 'Budget Optimizer', desc: 'Track spending across categories and get smart suggestions to maximize your travel budget.' },
  ];

  const travelStyles = [
    { name: 'Beach breaks', query: 'Beach', emoji: '🏖️', desc: 'Sun, sand and slow days', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80' },
    { name: 'Mountain escapes', query: 'Nature', emoji: '🏔️', desc: 'Cool air and wide views', img: 'https://images.unsplash.com/photo-1626621331169-5f34be280ed9?w=400&q=80' },
    { name: 'Heritage trails', query: 'History', emoji: '🏛️', desc: 'Forts, food and old cities', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80' },
    { name: 'Adventure trips', query: 'Adventure', emoji: '🥾', desc: 'For weekends with a story', img: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=400&q=80' },
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
              <div className="badge badge-warm">✨ Editor's Picks</div>
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
            <div className="badge badge-success">🌍 Explore India</div>
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
                  <span className="continent-card__emoji">{c.emoji}</span>
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
              <div className="badge badge-primary">💬 Reviews</div>
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
