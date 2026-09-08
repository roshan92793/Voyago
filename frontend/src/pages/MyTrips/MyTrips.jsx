import { useState } from 'react';
import { trips as mockTrips } from '../../data/trips';
import TripCard from '../../components/TripCard/TripCard';
import { tripStatuses } from '../../data/trips';
import './MyTrips.css';

const MyTrips = () => {
  const [trips, setTrips] = useState(mockTrips);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? trips : trips.filter((t) => t.status === filter);

  const handleDelete = (id) => {
    if (window.confirm('Delete this trip?')) {
      setTrips((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="my-trips section-padding" style={{ paddingTop: '7rem' }}>
      <div className="container">
        <div className="my-trips__header">
          <div className="page-header">
            <h1>My <span className="text-gradient">Trips</span></h1>
            <p>Track all your travel adventures in one place.</p>
          </div>
          <a href="/trip-planner" id="new-trip-btn" className="btn btn--primary btn--md">+ New Trip</a>
        </div>

        {/* Status filter */}
        <div className="my-trips__filters">
          {['all', ...tripStatuses].map((s) => (
            <button
              key={s}
              id={`trip-filter-${s}`}
              className={`filter-pill ${filter === s ? 'filter-pill--active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🗺️</div>
            <h2>No trips here yet</h2>
            <p>Start planning your next adventure!</p>
            <a href="/trip-planner" className="btn btn--primary btn--md">Plan a Trip →</a>
          </div>
        ) : (
          <div className="grid-3" style={{ marginTop: '2rem' }}>
            {filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
