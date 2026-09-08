import './Input.css';

const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon,
  required = false,
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label} {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`input-field ${icon ? 'input-field--has-icon' : ''}`}
          {...rest}
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;
