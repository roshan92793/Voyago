import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TripCard from '../../components/TripCard/TripCard';
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import ReviewCard from '../../components/ReviewCard/ReviewCard';
import { reviewsAPI, tripsAPI, wishlistAPI } from '../../services/api';
import { getInitials, formatDate } from '../../utils';
import './Profile.css';

const preferenceGroups = [
  { label: 'Travel style', options: ['Solo', 'Couple', 'Family', 'Friends'] },
  { label: 'Interests', options: ['Beaches', 'Mountains', 'Adventure', 'Culture', 'Food', 'Luxury', 'Nature'] },
  { label: 'Accommodation', options: ['Hotel', 'Resort', 'Homestay', 'Hostel'] },
  { label: 'Transportation', options: ['Flight', 'Train', 'Road trip', 'Public transport'] },
];

const settingItems = [
  ['Profile information', 'Profile editing will be available when the profile API is connected.'],
  ['Password & security', 'Manage your account security and sign-in options.'],
  ['Notifications', 'Choose the travel updates you want to receive.'],
  ['Language & currency', 'Set your preferred language and display currency.'],
  ['Privacy', 'Control how your account information is used.'],
];

const supportItems = [
  ['Help Center', 'Find answers to common travel questions.'],
  ['Contact support', 'Reach the Voyago team for assistance.'],
  ['Report a problem', 'Tell us when something is not working right.'],
  ['Terms & privacy', 'Review the terms and privacy policy.'],
];

const getTripStatus = (trip) => {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (end < now) return 'completed';
  if (start <= now && end >= now) return 'ongoing';
  return 'upcoming';
};

const normalizeTrip = (trip) => {
  const destination = trip.destination || {};
  return {
    ...trip,
    id: trip._id || trip.id,
    title: trip.title || destination.name || 'Voyago trip',
    destinations: [destination.name || destination.location || 'Destination'],
    coverImage: destination.images?.[0] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    status: getTripStatus(trip),
    budget: { spent: 0, total: Number(trip.budget) || 0 },
  };
};

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [tripFilter, setTripFilter] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', bio: '' });
  const [profileMessage, setProfileMessage] = useState('');
  const [preferences, setPreferences] = useState({});
  const [showLogout, setShowLogout] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewDraft, setReviewDraft] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    let active = true;
    Promise.allSettled([tripsAPI.getAll(), reviewsAPI.getAll(), wishlistAPI.getAll()])
      .then(([tripResult, reviewResult, wishlistResult]) => {
        if (!active) return;

        if (tripResult.status === 'fulfilled') {
          setTrips((tripResult.value.data.trips || []).map(normalizeTrip));
        }

        if (reviewResult.status === 'fulfilled') {
          const allReviews = reviewResult.value.data.reviews || [];
          setReviews(allReviews.filter((review) => (
            review.user?.email === user?.email || review.user?.name === user?.name
          )));
        }

        if (wishlistResult.status === 'fulfilled') {
          setSavedItems(wishlistResult.value.data.wishlist || []);
        }

        if (tripResult.status === 'rejected' && reviewResult.status === 'rejected' && wishlistResult.status === 'rejected') {
          setError('We could not load your travel activity right now.');
        }
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [user?.email, user?.name]);

  const savedDestinations = savedItems.map((item) => item.destination).filter(Boolean);
  const filteredTrips = trips.filter((trip) => tripFilter === 'all' || trip.status === tripFilter);
  const stats = [
    ['Trips', trips.length, 'Trips'],
    ['Places visited', new Set(trips.flatMap((trip) => trip.destinations)).size, 'Places visited'],
    ['Reviews', reviews.length, 'Reviews'],
    ['Saved', savedDestinations.length, 'Saved'],
  ];

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    setProfileMessage('Your changes are ready, but profile updates need a backend endpoint before they can be saved.');
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleDeleteReview = async (id) => {
    try {
      await reviewsAPI.delete(id);
      setReviews((current) => current.filter((review) => review._id !== id));
    } catch {
      setError('Unable to delete that review right now.');
    }
  };

  const handleReviewSave = async (event) => {
    event.preventDefault();
    try {
      const response = await reviewsAPI.update(editingReview._id, reviewDraft);
      setReviews((current) => current.map((review) => review._id === editingReview._id ? response.data.review : review));
      setEditingReview(null);
    } catch {
      setError('Unable to update that review right now.');
    }
  };

  const startReviewEdit = (review) => {
    setEditingReview(review);
    setReviewDraft({ rating: review.rating, comment: review.comment || review.content || '' });
  };

  const togglePreference = (option) => setPreferences((current) => ({ ...current, [option]: !current[option] }));

  return (
    <div className="profile section-padding">
      <div className="container">
        <div className="profile__header">
          <div className="profile__avatar">
            {getInitials(user?.name)}
          </div>
          <div className="profile__identity">
            <div className="profile__identity-top">
              <div>
                <p className="profile__eyebrow">Voyago traveler</p>
                <h1 className="profile__name">{user?.name}</h1>
                <p className="profile__email">{user?.email}</p>
              </div>
              <button type="button" className="btn btn--secondary btn--md" onClick={() => document.getElementById('profile-editor')?.scrollIntoView({ behavior: 'smooth' })}>Edit Profile</button>
            </div>
            <span className={`badge ${user?.role === 'admin' ? 'badge-warm' : 'badge-primary'}`}>
              {user?.role === 'admin' ? 'Admin' : 'Traveler'}
            </span>
          </div>
        </div>

        <div className="profile__stats">
          {stats.map(([label, value, statLabel]) => (
            <div key={statLabel} className="profile__stat">
              <span className="profile__stat-value">{loading ? '—' : value}</span>
              <span className="profile__stat-label">{statLabel}</span>
              <span className="profile__stat-icon">{label}</span>
            </div>
          ))}
        </div>

        {error && <div className="profile__notice profile__notice--error" role="alert">{error}</div>}

        <section className="profile__section profile__section--trips">
          <div className="profile__section-header">
            <div><p className="profile__eyebrow">Your itinerary</p><h2>My Trips</h2></div>
            <Link to="/trip-planner" className="btn btn--primary btn--md">Plan a Trip</Link>
          </div>
          <div className="profile__filters">
            {['upcoming', 'ongoing', 'completed', 'cancelled', 'all'].map((filter) => (
              <button key={filter} type="button" className={`filter-pill ${tripFilter === filter ? 'filter-pill--active' : ''}`} onClick={() => setTripFilter(filter)}>
                {filter[0].toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          {loading ? <div className="profile__loading">Loading your trips…</div> : filteredTrips.length ? (
            <div className="profile__trip-grid">{filteredTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)}</div>
          ) : <div className="profile__empty"><h3>No {tripFilter === 'all' ? '' : tripFilter} trips yet</h3><p>Your next story starts with a plan.</p><Link to="/trip-planner" className="btn btn--primary btn--md">Start planning</Link></div>}
        </section>

        <div className="profile__columns">
          <section className="profile__section">
            <div className="profile__section-header"><div><p className="profile__eyebrow">Saved for later</p><h2>Saved Destinations</h2></div><Link to="/wishlist" className="profile__text-link">View all →</Link></div>
            {savedDestinations.length ? <div className="profile__saved-grid">{savedDestinations.slice(0, 2).map((destination) => <DestinationCard key={destination.id} destination={destination} />)}</div> : <div className="profile__empty profile__empty--small"><h3>No saved destinations</h3><p>Keep the places that inspire you close.</p><Link to="/explore" className="profile__text-link">Explore destinations →</Link></div>}
          </section>

          <section className="profile__section">
            <div className="profile__section-header"><div><p className="profile__eyebrow">Your voice</p><h2>My Reviews</h2></div><Link to="/reviews" className="profile__text-link">Community reviews →</Link></div>
            {reviews.length ? <div className="profile__reviews">{reviews.slice(0, 2).map((review) => <div key={review._id} className="profile__review-wrap"><div className="profile__review-destination">{review.destination?.name || 'Destination'}</div><ReviewCard review={review} /><div className="profile__review-actions"><button type="button" onClick={() => startReviewEdit(review)}>Edit</button><button type="button" onClick={() => handleDeleteReview(review._id)}>Delete</button></div></div>)}</div> : <div className="profile__empty profile__empty--small"><h3>No reviews yet</h3><p>Share the details that help other travelers.</p><Link to="/reviews" className="profile__text-link">Browse reviews →</Link></div>}
          </section>
        </div>

        <section className="profile__section profile__section--preferences">
          <div className="profile__section-header"><div><p className="profile__eyebrow">Make it yours</p><h2>Travel Preferences</h2></div><span className="profile__coming-soon">Ready for your next trip</span></div>
          <div className="profile__preferences">{preferenceGroups.map((group) => <div key={group.label} className="profile__preference-group"><h3>{group.label}</h3><div className="profile__chips">{group.options.map((option) => <button type="button" key={option} className={`profile__chip ${preferences[option] ? 'profile__chip--active' : ''}`} onClick={() => togglePreference(option)}>{option}</button>)}</div></div>)}</div>
          <div className="profile__preference-note">Preferences are currently saved for this session. A profile preferences API can persist them later.</div>
        </section>

        <div className="profile__columns profile__columns--bottom">
          <section id="profile-editor" className="profile__section profile__section--editor">
            <div className="profile__section-header"><div><p className="profile__eyebrow">Account</p><h2>Edit Profile</h2></div></div>
            <form className="profile__form" onSubmit={handleProfileSubmit}>
              {['name', 'email', 'phone', 'bio'].map((field) => <label key={field} className="profile__field">{field === 'bio' ? 'About you' : field[0].toUpperCase() + field.slice(1)}<input value={profileForm[field]} type={field === 'email' ? 'email' : 'text'} placeholder={field === 'phone' ? 'Add a phone number' : ''} onChange={(event) => setProfileForm({ ...profileForm, [field]: event.target.value })} /></label>)}
              <button type="submit" className="btn btn--primary btn--md">Save Changes</button>
              {profileMessage && <p className="profile__notice">{profileMessage}</p>}
            </form>
          </section>

          <section className="profile__section">
            <div className="profile__section-header"><div><p className="profile__eyebrow">Account controls</p><h2>Settings</h2></div></div>
            <div className="profile__settings">{settingItems.map(([title, description]) => <button type="button" className="profile__setting" key={title} onClick={() => setProfileMessage(`${title} will be available in a future account update.`)}><span><strong>{title}</strong><small>{description}</small></span><span className="profile__setting-arrow">→</span></button>)}</div>
          </section>
        </div>

        <section className="profile__section profile__section--support">
          <div className="profile__section-header"><div><p className="profile__eyebrow">We are here to help</p><h2>Help & Support</h2></div></div>
          <div className="profile__support-grid">{supportItems.map(([title, description]) => <button type="button" className="profile__support-item" key={title} onClick={() => setProfileMessage(`${title} is ready to connect to the support workflow.`)}><strong>{title}</strong><small>{description}</small></button>)}</div>
        </section>

        <section className="profile__section profile__section--logout">
          <div><p className="profile__eyebrow">Done for today?</p><h2>Sign out of Voyago</h2><p>Your trips and saved places will be waiting when you return.</p></div>
          <button type="button" className="profile__logout" onClick={() => setShowLogout(true)}>Log out</button>
        </section>

        {editingReview && <div className="profile__modal-backdrop" role="presentation"><div className="profile__modal" role="dialog" aria-modal="true" aria-labelledby="edit-review-title"><div className="profile__section-header"><h2 id="edit-review-title">Edit review</h2><button type="button" className="profile__modal-close" onClick={() => setEditingReview(null)}>×</button></div><form className="profile__form" onSubmit={handleReviewSave}><label className="profile__field">Rating<input type="number" min="1" max="5" value={reviewDraft.rating} onChange={(event) => setReviewDraft({ ...reviewDraft, rating: Number(event.target.value) })} /></label><label className="profile__field">Review<textarea value={reviewDraft.comment} onChange={(event) => setReviewDraft({ ...reviewDraft, comment: event.target.value })} /></label><button type="submit" className="btn btn--primary btn--md">Save review</button></form></div></div>}
        {showLogout && <div className="profile__modal-backdrop" role="presentation"><div className="profile__modal" role="dialog" aria-modal="true" aria-labelledby="logout-title"><h2 id="logout-title">Leave Voyago?</h2><p>You can sign back in whenever you are ready for your next adventure.</p><div className="profile__modal-actions"><button type="button" className="btn btn--secondary btn--md" onClick={() => setShowLogout(false)}>Cancel</button><button type="button" className="profile__logout" onClick={handleLogout}>Log out</button></div></div></div>}
      </div>
    </div>
  );
};

export default Profile;
