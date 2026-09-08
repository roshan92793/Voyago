import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import './Error.css';

const Error = ({
  code = '404',
  title = 'Page Not Found',
  message = "The page you're looking for doesn't exist or has been moved.",
  showHome = true,
  onRetry,
}) => {
  return (
    <div className="error-page">
      <div className="error-page__content">
        <div className="error-page__code">{code}</div>
        <h1 className="error-page__title">{title}</h1>
        <p className="error-page__message">{message}</p>
        <div className="error-page__actions">
          {onRetry && (
            <Button id="error-retry-btn" onClick={onRetry} variant="primary">
              Try Again
            </Button>
          )}
          {showHome && (
            <Link to="/">
              <Button id="error-home-btn" variant="secondary">← Go Home</Button>
            </Link>
          )}
        </div>
      </div>
      <div className="error-page__decoration">🌍</div>
    </div>
  );
};

export default Error;
