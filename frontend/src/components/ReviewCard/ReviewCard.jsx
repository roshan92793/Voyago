import { getStars, formatDate, truncate } from '../../utils';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  const { full, half, empty } = getStars(review.rating);
  const author = review.userName || review.user?.name || 'Voyago traveler';
  const date = review.date || review.createdAt;
  const content = review.content || review.comment;
  return (
    <article className="review-card" id={`review-${review._id || review.id}`}>
      {/* Header */}
      <div className="review-card__header">
        <img src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=0099cc&color=fff`} alt={author} className="review-card__avatar" loading="lazy" />
        <div className="review-card__meta">
          <span className="review-card__name">{author}</span>
          <span className="review-card__date">{formatDate(date)}</span>
        </div>
        <div className="review-card__rating">
          <div className="stars" aria-label={`${review.rating} out of 5 stars`}>
            {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}
          </div>
          <span>{review.rating}</span>
        </div>
      </div>

      {/* Content */}
      {review.title && <h4 className="review-card__title">&ldquo;{review.title}&rdquo;</h4>}
      <p className="review-card__body">{truncate(content, 180)}</p>

      {/* Tags */}
      {review.tags?.length > 0 && (
        <div className="review-card__tags">
          {review.tags.map((t) => (
            <span key={t} className="review-card__tag">{t}</span>
          ))}
        </div>
      )}

      {/* Helpful */}
      {typeof review.helpful === 'number' && <div className="review-card__helpful"><span>👍 {review.helpful} found this helpful</span></div>}
    </article>
  );
};

export default ReviewCard;
