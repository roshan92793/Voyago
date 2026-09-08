import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile section-padding" style={{ paddingTop: '7rem' }}>
      <div className="container">
        <div className="profile__header">
          <div className="profile__avatar">
            {getInitials(user?.name)}
          </div>
          <div>
            <h1 className="profile__name">{user?.name}</h1>
            <p className="profile__email">📧 {user?.email}</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-warm' : 'badge-primary'}`}>
              {user?.role === 'admin' ? '👑 Admin' : '🌍 Traveler'}
            </span>
          </div>
        </div>

        <div className="profile__grid">
          {/* Stats */}
          <div className="profile__card">
            <h3>Your Stats</h3>
            <div className="profile__stats">
              {[
                { icon: '✈️', label: 'Trips Planned', value: 3 },
                { icon: '❤️', label: 'Wishlisted',   value: 5 },
                { icon: '⭐', label: 'Reviews Left',  value: 2 },
                { icon: '🌍', label: 'Countries',     value: 8 },
              ].map(({ icon, label, value }) => (
                <div key={label} className="profile__stat">
                  <span className="profile__stat-icon">{icon}</span>
                  <span className="profile__stat-value">{value}</span>
                  <span className="profile__stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Edit */}
          <div className="profile__card">
            <h3>Edit Profile</h3>
            <form className="profile__form">
              <div className="input-group">
                <label className="input-label" htmlFor="prof-name">Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input id="prof-name" className="input-field input-field--has-icon" defaultValue={user?.name} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="prof-email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input id="prof-email" type="email" className="input-field input-field--has-icon" defaultValue={user?.email} />
                </div>
              </div>
              <button id="save-profile-btn" type="submit" className="btn btn--primary btn--md">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
