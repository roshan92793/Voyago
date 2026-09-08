import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  icon,
  className = '',
  id,
  ...rest
}) => {
  return (
    <button
      id={id}
      type={type}
      className={`btn btn--${variant} btn--${size} ${loading ? 'btn--loading' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="btn__spinner" />
      ) : (
        <>
          {icon && <span className="btn__icon">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
