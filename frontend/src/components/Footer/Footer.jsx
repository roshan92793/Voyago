import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  const location = useLocation();
  const isLight = ['/login', '/register'].includes(location.pathname);
  return (
    <footer className={`footer ${isLight ? 'footer--light' : ''}`}>
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">✈️ Voyago</Link>
            <p>Your ultimate travel companion. Discover breathtaking destinations, plan your perfect trip, and create memories that last a lifetime.</p>
            <div className="footer__socials">
              <a href="#" aria-label="Twitter" id="footer-twitter">🐦</a>
              <a href="#" aria-label="Instagram" id="footer-instagram">📸</a>
              <a href="#" aria-label="YouTube" id="footer-youtube">▶️</a>
              <a href="#" aria-label="LinkedIn" id="footer-linkedin">💼</a>
            </div>
          </div>

          {/* Explore */}
          <div className="footer__col">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/explore">Destinations</Link></li>
              <li><Link to="/explore?tag=Beach">Beach Escapes</Link></li>
              <li><Link to="/explore?tag=Adventure">Adventures</Link></li>
              <li><Link to="/explore?tag=Cultural">Cultural Trips</Link></li>
              <li><Link to="/reviews">Reviews</Link></li>
            </ul>
          </div>

          {/* Plan */}
          <div className="footer__col">
            <h4>Plan</h4>
            <ul>
              <li><Link to="/trip-planner">Trip Planner</Link></li>
              <li><Link to="/my-trips">My Trips</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer__col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {year} Voyago. All rights reserved. Made with ❤️ for travelers worldwide.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
