import { useEffect, useState } from 'react';
import { trips } from '../../data/trips';
import { formatCurrency, formatDate } from '../../utils';
import { destinationsAPI, reviewsAPI } from '../../services/api';
import './Admin.css';

const DestinationIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" strokeWidth="2.8"/>
    <path d="M22 32h20M32 22v20" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
    <path d="M12 12h40v40H12z" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round" opacity="0.7"/>
  </svg>
);

const ReviewIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M18 20.5c0-5.3 4.2-9.5 9.5-9.5h9c5.3 0 9.5 4.2 9.5 9.5v11.5c0 5.3-4.2 9.5-9.5 9.5h-6.6L22 49l1.7-7.4A9.5 9.5 0 0 1 18 32.1V20.5Z" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round"/>
    <path d="m26 27 4 4 8-10" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TripIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M16 22h32l-4 24H20l-4-24Z" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round"/>
    <path d="M24 22V16h16v6M20 30h24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="24" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="2.8"/>
    <path d="M14 48c2-7 8-10 18-10s16 3 18 10" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
    <path d="M42 18c4 1 7 5 7 9 0 5-4 9-9 9" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/>
  </svg>
);

const StatCard = ({ icon, label, value, color }) => (
  <div className="admin-stat" style={{ '--stat-color': color }}>
    <span className="admin-stat__icon">{icon}</span>
    <span className="admin-stat__val">{value}</span>
    <span className="admin-stat__label">{label}</span>
  </div>
);

const emptyForm = {
  name: '',
  country: 'India',
  location: '',
  state: '',
  description: '',
  averageBudget: '',
  rating: '4.5',
  attractions: '',
  images: '',
};

const Admin = () => {
  const [destinations, setDestinations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const loadDestinations = async () => {
    try {
      const response = await destinationsAPI.getAll();
      setDestinations(response.data.destinations || []);
    } catch (err) {
      setError('Unable to load destinations right now.');
    }
  };

  useEffect(() => {
    loadDestinations();
    reviewsAPI.getAll().then((response) => setReviews(response.data.reviews || [])).catch(() => {});
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError('');
    setIsFormOpen(true);
  };

  const openEditForm = (destination) => {
    setEditingId(destination._id || destination.id);
    setFormData({
      name: destination.name || '',
      country: destination.country || 'India',
      location: destination.location || '',
      state: destination.state || '',
      description: destination.description || '',
      averageBudget: destination.averageBudget ?? '',
      rating: destination.rating ?? '4.5',
      attractions: Array.isArray(destination.attractions) ? destination.attractions.join(', ') : '',
      images: Array.isArray(destination.images) ? destination.images.join(', ') : '',
    });
    setError('');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError('');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const payload = {
        name: formData.name.trim(),
        country: formData.country.trim() || 'India',
        location: formData.location.trim(),
        state: formData.state.trim(),
        description: formData.description.trim(),
        averageBudget: Number(formData.averageBudget) || 0,
        rating: Number(formData.rating) || 0,
        attractions: formData.attractions.split(',').map((item) => item.trim()).filter(Boolean),
        images: formData.images.split(',').map((item) => item.trim()).filter(Boolean),
      };

      if (!payload.name || !payload.location || !payload.state || !payload.description) {
        setError('Please fill in name, location, state, and description.');
        setIsSaving(false);
        return;
      }

      if (editingId) {
        const response = await destinationsAPI.update(editingId, payload);
        const updatedDestination = response.data.destination;
        setDestinations((prev) => prev.map((destination) => (
          (destination._id || destination.id) === editingId ? { ...destination, ...updatedDestination } : destination
        )));
      } else {
        const response = await destinationsAPI.create(payload);
        setDestinations((prev) => [response.data.destination, ...prev]);
      }

      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong while saving the destination.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDestination = async (id) => {
    try {
      await destinationsAPI.delete(id);
      setDestinations((prev) => prev.filter((destination) => (destination._id || destination.id) !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete destination right now.');
    }
  };

  const [reviewEditId, setReviewEditId] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: '5', comment: '' });

  const openReviewEdit = (review) => {
    setReviewEditId(review._id || review.id);
    setReviewForm({
      rating: String(review.rating || 5),
      comment: review.comment || '',
    });
    setError('');
  };

  const closeReviewEdit = () => {
    setReviewEditId(null);
    setReviewForm({ rating: '5', comment: '' });
    setError('');
  };

  const handleReviewFormChange = (event) => {
    const { name, value } = event.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveReview = async (event) => {
    event.preventDefault();
    if (!reviewEditId) return;

    const rating = Number(reviewForm.rating);
    const comment = reviewForm.comment.trim();

    if (!comment) {
      setError('Review comment is required.');
      return;
    }

    try {
      const response = await reviewsAPI.update(reviewEditId, { rating, comment });
      const updatedReview = response.data.review;
      setReviews((prev) => prev.map((review) => (review._id || review.id) === reviewEditId ? { ...review, ...updatedReview } : review));
      closeReviewEdit();
    } catch (err) {
      setError(err.response?.data?.message || 'The review could not be updated.');
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await reviewsAPI.delete(id);
      setReviews((prev) => prev.filter((review) => (review._id || review.id) !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete review right now.');
    }
  };

  const stats = [
    { icon: <DestinationIcon />, label: 'Destinations', value: destinations.length, color: 'var(--primary)' },
    { icon: <ReviewIcon />, label: 'Reviews', value: reviews.length, color: 'var(--accent-warm)' },
    { icon: <TripIcon />, label: 'Trips', value: trips.length, color: 'var(--accent)' },
    { icon: <UsersIcon />, label: 'Users (mock)', value: 52, color: 'var(--secondary)' },
  ];

  return (
    <div className="admin section-padding" style={{ paddingTop: '7rem' }}>
      <div className="container admin__container">
        <div className="page-header" style={{ marginBottom: '2.5rem' }}>
          <h1><span className="text-gradient">Admin Dashboard</span></h1>
          <p>Platform overview and management panel.</p>
        </div>

        <div className="admin__stats">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        <div className="admin__section">
          <div className="admin__section-header">
            <h2>Destinations</h2>
            <button type="button" id="admin-add-dest-btn" className="btn btn--primary btn--sm" onClick={openAddForm}>+ Add</button>
          </div>
          <div className="admin__table-wrap">
            <table className="admin__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Country</th>
                  <th>Rating</th>
                  <th>Price</th>
                  <th>Tags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((d) => (
                  <tr key={d._id || d.id}>
                    <td>
                      <div className="admin__dest-name">
                        <img src={d.images?.[0] || d.image || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80'} alt={d.name} className="admin__dest-img" loading="lazy" />
                        <span>{d.name}</span>
                      </div>
                    </td>
                    <td>{d.country}</td>
                    <td><span style={{ color: 'var(--accent-warm)' }}>★ {d.rating}</span></td>
                    <td>{formatCurrency(d.averageBudget || d.price || 0, 'INR')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {(d.attractions || d.tags || []).slice(0, 2).map((t) => <span key={t} className="admin__tag">{t}</span>)}
                      </div>
                    </td>
                    <td>
                      <div className="admin__actions">
                        <button type="button" id={`admin-edit-dest-${d._id || d.id}`} className="admin__action-btn admin__action-btn--edit" onClick={() => openEditForm(d)}>Edit</button>
                        <button type="button" id={`admin-del-dest-${d._id || d.id}`} className="admin__action-btn admin__action-btn--del" onClick={() => handleDeleteDestination(d._id || d.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin__section">
          <div className="admin__section-header">
            <h2>Recent Reviews</h2>
          </div>
          <div className="admin__table-wrap">
            <table className="admin__table">
              <thead>
                <tr><th>User</th><th>Title</th><th>Rating</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r._id || r.id}>
                    <td>{r.user?.name || 'Voyago traveler'}</td>
                    <td>{r.comment}</td>
                    <td><span style={{ color: 'var(--accent-warm)' }}>★ {r.rating}</span></td>
                    <td>{formatDate(r.createdAt)}</td>
                    <td>
                      <div className="admin__actions">
                        <button type="button" id={`admin-edit-review-${r._id || r.id}`} className="admin__action-btn admin__action-btn--edit" onClick={() => openReviewEdit(r)}>Edit</button>
                        <button type="button" id={`admin-del-review-${r._id || r.id}`} className="admin__action-btn admin__action-btn--del" onClick={() => handleDeleteReview(r._id || r.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {reviewEditId && (
        <div className="admin__modal-overlay" onClick={closeReviewEdit}>
          <div className="admin__modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin__modal-header">
              <h3>Edit Review</h3>
              <button type="button" className="admin__close-btn" onClick={closeReviewEdit}>✕</button>
            </div>

            <form className="admin__form" onSubmit={handleSaveReview}>
              <div className="admin__form-grid">
                <label className="admin__field">
                  <span>Rating</span>
                  <input type="number" min="1" max="5" name="rating" value={reviewForm.rating} onChange={handleReviewFormChange} />
                </label>

                <label className="admin__field admin__field--full">
                  <span>Comment</span>
                  <textarea name="comment" rows="5" value={reviewForm.comment} onChange={handleReviewFormChange} placeholder="Write the review update" />
                </label>
              </div>

              {error && <div className="admin__form-error">{error}</div>}

              <div className="admin__form-actions">
                <button type="button" className="admin__cancel-btn" onClick={closeReviewEdit}>Cancel</button>
                <button type="submit" className="btn btn--primary btn--sm">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="admin__modal-overlay" onClick={closeForm}>
          <div className="admin__modal" onClick={(event) => event.stopPropagation()}>
            <div className="admin__modal-header">
              <h3>{editingId ? 'Edit Destination' : 'Add Destination'}</h3>
              <button type="button" className="admin__close-btn" onClick={closeForm}>✕</button>
            </div>

            <form className="admin__form" onSubmit={handleSubmit}>
              <div className="admin__form-grid">
                <label className="admin__field">
                  <span>Name</span>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Goa" />
                </label>

                <label className="admin__field">
                  <span>Country</span>
                  <input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="India" />
                </label>

                <label className="admin__field">
                  <span>Location</span>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="North Goa" />
                </label>

                <label className="admin__field">
                  <span>State</span>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="Goa" />
                </label>

                <label className="admin__field admin__field--full">
                  <span>Description</span>
                  <textarea name="description" rows="4" value={formData.description} onChange={handleInputChange} placeholder="Describe the destination" />
                </label>

                <label className="admin__field">
                  <span>Average Budget</span>
                  <input type="number" name="averageBudget" value={formData.averageBudget} onChange={handleInputChange} placeholder="18000" />
                </label>

                <label className="admin__field">
                  <span>Rating</span>
                  <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating} onChange={handleInputChange} placeholder="4.5" />
                </label>

                <label className="admin__field admin__field--full">
                  <span>Attractions</span>
                  <input type="text" name="attractions" value={formData.attractions} onChange={handleInputChange} placeholder="Beach, nightlife, forts" />
                </label>

                <label className="admin__field admin__field--full">
                  <span>Image URLs</span>
                  <input type="text" name="images" value={formData.images} onChange={handleInputChange} placeholder="https://..., https://..." />
                </label>
              </div>

              {error && <div className="admin__form-error">{error}</div>}

              <div className="admin__form-actions">
                <button type="button" className="admin__cancel-btn" onClick={closeForm}>Cancel</button>
                <button type="submit" className="btn btn--primary btn--sm" disabled={isSaving}>
                  {isSaving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;