import { destinations } from '../../data/destinations';
import { reviews } from '../../data/reviews';
import { trips } from '../../data/trips';
import './Admin.css';

const StatCard = ({ icon, label, value, color }) => (
  <div className="admin-stat" style={{ '--stat-color': color }}>
    <span className="admin-stat__icon">{icon}</span>
    <span className="admin-stat__val">{value}</span>
    <span className="admin-stat__label">{label}</span>
  </div>
);

const Admin = () => {
  const stats = [
    { icon: '🌍', label: 'Destinations', value: destinations.length, color: 'var(--primary)' },
    { icon: '⭐', label: 'Reviews', value: reviews.length, color: 'var(--accent-warm)' },
    { icon: '✈️', label: 'Trips', value: trips.length, color: 'var(--accent)' },
    { icon: '👥', label: 'Users (mock)', value: 52, color: 'var(--secondary)' },
  ];

  return (
    <div className="admin section-padding" style={{ paddingTop: '7rem' }}>
      <div className="container">
        <div className="page-header" style={{ marginBottom: '2.5rem' }}>
          <h1>👑 Admin <span className="text-gradient">Dashboard</span></h1>
          <p>Platform overview and management panel.</p>
        </div>

        {/* Stats */}
        <div className="admin__stats">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Destinations table */}
        <div className="admin__section">
          <div className="admin__section-header">
            <h2>Destinations</h2>
            <button id="admin-add-dest-btn" className="btn btn--primary btn--sm">+ Add</button>
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
                  <tr key={d.id}>
                    <td>
                      <div className="admin__dest-name">
                        <img src={d.image} alt={d.name} className="admin__dest-img" loading="lazy" />
                        <span>{d.name}</span>
                      </div>
                    </td>
                    <td>{d.country}</td>
                    <td><span style={{ color: 'var(--accent-warm)' }}>★ {d.rating}</span></td>
                    <td>${d.price.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {d.tags.slice(0, 2).map((t) => <span key={t} className="admin__tag">{t}</span>)}
                      </div>
                    </td>
                    <td>
                      <div className="admin__actions">
                        <button id={`admin-edit-dest-${d.id}`} className="admin__action-btn admin__action-btn--edit">Edit</button>
                        <button id={`admin-del-dest-${d.id}`} className="admin__action-btn admin__action-btn--del">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Reviews */}
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
                  <tr key={r.id}>
                    <td>{r.userName}</td>
                    <td>{r.title}</td>
                    <td><span style={{ color: 'var(--accent-warm)' }}>★ {r.rating}</span></td>
                    <td>{r.date}</td>
                    <td>
                      <button id={`admin-del-review-${r.id}`} className="admin__action-btn admin__action-btn--del">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
