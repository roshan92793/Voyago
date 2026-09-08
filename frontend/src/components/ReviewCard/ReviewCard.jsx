import { getStars, formatDate, truncate } from '../../utils';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  const { full, half, empty } = getStars(review.rating);
  return (
    <article className="review-card" id={`review-${review.id}`}>
      {/* Header */}
      <div className="review-card__header">
        <img src={review.userAvatar} alt={review.userName} className="review-card__avatar" loading="lazy" />
        <div className="review-card__meta">
          <span className="review-card__name">{review.userName}</span>
          <span className="review-card__date">{formatDate(review.date)}</span>
        </div>
        <div className="review-card__rating">
          <div className="stars" aria-label={`${review.rating} out of 5 stars`}>
            {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}
          </div>
          <span>{review.rating}</span>
        </div>
      </div>

      {/* Content */}
      <h4 className="review-card__title">&ldquo;{review.title}&rdquo;</h4>
      <p className="review-card__body">{truncate(review.content, 180)}</p>

      {/* Tags */}
      {review.tags?.length > 0 && (
        <div className="review-card__tags">
          {review.tags.map((t) => (
            <span key={t} className="review-card__tag">{t}</span>
          ))}
        </div>
      )}

      {/* Helpful */}
      <div className="review-card__helpful">
        <span>👍 {review.helpful} found this helpful</span>
      </div>
    </article>
  );
};

export default ReviewCard;
