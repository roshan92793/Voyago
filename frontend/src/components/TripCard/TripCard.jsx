import { Link } from 'react-router-dom';
import { formatDate, daysBetween, statusColors } from '../../utils';
import './TripCard.css';

const TripCard = ({ trip, onDelete }) => {
  const status = statusColors[trip.status] || statusColors.planning;
  const duration = daysBetween(trip.startDate, trip.endDate);

  return (
    <article className="trip-card" id={`trip-card-${trip.id}`}>
      {/* Cover */}
      <div className="trip-card__cover">
        <img src={trip.coverImage} alt={trip.title} loading="lazy" />
        <div className="trip-card__cover-overlay" />
        <div className="trip-card__status" style={{ background: status.bg, color: status.color }}>
          {status.label}
        </div>
      </div>

      {/* Body */}
      <div className="trip-card__body">
        <h3 className="trip-card__title">{trip.title}</h3>
        <div className="trip-card__destinations">
          📍 {trip.destinations.join(' · ')}
        </div>
        <div className="trip-card__dates">
          <span>🗓 {formatDate(trip.startDate)} → {formatDate(trip.endDate)}</span>
          <span className="trip-card__duration">{duration} days</span>
        </div>

        {/* Budget */}
        <div className="trip-card__budget">
          <div className="trip-card__budget-header">
            <span>Budget</span>
            <span>${trip.budget.spent.toLocaleString()} / ${trip.budget.total.toLocaleString()}</span>
          </div>
          <div className="trip-card__budget-bar">
            <div
              className="trip-card__budget-fill"
              style={{ width: `${Math.min((trip.budget.spent / trip.budget.total) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="trip-card__actions">
          <Link to={`/my-trips/${trip.id}`} id={`trip-view-${trip.id}`} className="trip-card__btn trip-card__btn--primary">
            View Trip
          </Link>
          {onDelete && (
            <button id={`trip-delete-${trip.id}`} className="trip-card__btn trip-card__btn--danger" onClick={() => onDelete(trip.id)}>
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default TripCard;
