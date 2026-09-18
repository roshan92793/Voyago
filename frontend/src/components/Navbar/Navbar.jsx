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
        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)} aria-label="Voyago home">
          <span className="navbar__logo-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 13.5L21.5 4.5L17.5 19.5L13.5 15.5L10 18.5L9.5 14.5L2.5 13.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.5 15.5L9 11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </span>
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
                    <span className="nav-dropdown__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12.5C14.7614 12.5 17 10.2614 17 7.5C17 4.73858 14.7614 2.5 12 2.5C9.23858 2.5 7 4.73858 7 7.5C7 10.2614 9.23858 12.5 12 12.5Z" stroke="currentColor" strokeWidth="1.7"/><path d="M4 20.5C5.5 17.5 8.2 16 12 16C15.8 16 18.5 17.5 20 20.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
                    </span>
                    Profile
                  </Link>
                  <Link to="/my-trips" className="nav-dropdown__item" onClick={() => setDropdown(false)}>
                    <span className="nav-dropdown__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 18.5L9.5 12.5L13.5 16.5L20.5 9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 9.5H20.5V13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 6.5H19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
                    </span>
                    My Trips
                  </Link>
                  <Link to="/wishlist" className="nav-dropdown__item" onClick={() => setDropdown(false)}>
                    <span className="nav-dropdown__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20.5C11.7 20.5 11.4 20.4 11.2 20.2C5.5 15.6 2.5 12.8 2.5 9.2C2.5 6.8 4.3 5 6.7 5C8.3 5 9.6 5.7 10.5 6.8C11.1 6.1 12.1 5.5 13.5 5.5C15.9 5.5 17.7 6.8 17.7 9.2C17.7 12.8 14.7 15.6 9 20.2C8.8 20.4 8.5 20.5 8.2 20.5H12Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>
                    </span>
                    Wishlist
                  </Link>
                  <hr className="nav-dropdown__divider" />
                  <button className="nav-dropdown__item nav-dropdown__item--danger" onClick={handleLogout}>
                    <span className="nav-dropdown__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 12H4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M13 4.5H18.5V19.5H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    Logout
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
