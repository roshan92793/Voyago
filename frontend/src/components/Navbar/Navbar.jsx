import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useScrollPosition } from '../../hooks';
import { getInitials } from '../../utils';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [dropdownOpen, setDropdown] = useState(false);
  const scrollY = useScrollPosition();
  const navigate = useNavigate();
  const location = useLocation();
  const isLight = ['/login', '/register'].includes(location.pathname);

  const handleLogout = () => {
    logout();
    setDropdown(false);
    navigate('/');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.nav-user')) setDropdown(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <nav className={`navbar ${isLight ? 'navbar--light' : ''} ${scrollY > 50 && !isLight ? 'navbar--scrolled' : ''} ${scrollY > 50 && isLight ? 'navbar--light-scrolled' : ''}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <span className="navbar__logo-icon">✈️</span>
          <span className="navbar__logo-text">Voyago</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <li><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/explore" onClick={() => setMenuOpen(false)}>Explore</NavLink></li>
          {isAuthenticated && (
            <>
              <li><NavLink to="/my-trips" onClick={() => setMenuOpen(false)}>My Trips</NavLink></li>
              <li><NavLink to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</NavLink></li>
              <li><NavLink to="/trip-planner" onClick={() => setMenuOpen(false)}>Plan Trip</NavLink></li>
            </>
          )}
          <li><NavLink to="/reviews" onClick={() => setMenuOpen(false)}>Reviews</NavLink></li>
          {isAdmin && <li><NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink></li>}
        </ul>

        {/* Right side */}
        <div className="navbar__right">
          {isAuthenticated ? (
            <div className="nav-user" onClick={() => setDropdown((p) => !p)}>
              <div className="nav-user__avatar">{getInitials(user?.name)}</div>
              <span className="nav-user__name">{user?.name?.split(' ')[0]}</span>
              <svg className={`nav-user__chevron ${dropdownOpen ? 'nav-user__chevron--open' : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {dropdownOpen && (
                <div className="nav-dropdown">
                  <Link to="/profile" className="nav-dropdown__item" onClick={() => setDropdown(false)}>
                    <span>👤</span> Profile
                  </Link>
                  <Link to="/my-trips" className="nav-dropdown__item" onClick={() => setDropdown(false)}>
                    <span>🗺️</span> My Trips
                  </Link>
                  <Link to="/wishlist" className="nav-dropdown__item" onClick={() => setDropdown(false)}>
                    <span>❤️</span> Wishlist
                  </Link>
                  <hr className="nav-dropdown__divider" />
                  <button className="nav-dropdown__item nav-dropdown__item--danger" onClick={handleLogout}>
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn-primary-sm">Sign Up</Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            id="nav-menu-toggle"
            className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
