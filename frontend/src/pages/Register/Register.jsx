import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim())   errs.name = 'Name is required';
    if (!form.email.includes('@')) errs.email = 'Valid email required';
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(form.password))
    errs.password = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      {/* Sun effect – top left */}
      <div className="auth__sun" aria-hidden="true" />
      {/* Sky cloud blobs */}
      <div className="auth__cloud auth__cloud--1" aria-hidden="true" />
      <div className="auth__cloud auth__cloud--2" aria-hidden="true" />
      <div className="auth__cloud auth__cloud--3" aria-hidden="true" />

      <div className="auth__card">
        <div className="auth__logo">✈️ Voyago</div>
        <h1 className="auth__title">Create account</h1>
        <p className="auth__sub">Start planning your dream trips today.</p>

        {apiError && <div className="auth__error" role="alert">{apiError}</div>}

        <form onSubmit={handleSubmit} className="auth__form">
          <Input id="name" label="Full Name" value={form.name} onChange={handleChange} placeholder="Your Name" error={errors.name} required />
          <Input id="email" label="Email" type="email" value={form.email} onChange={handleChange} placeholder="your@gmail.com"  error={errors.email} required />
          <div>
            <Input id="password" label="Password" type="password" value={form.password} onChange={handleChange} placeholder="Create a strong password" icon="🔒" error={errors.password} required />
            <p className="auth__password-hint">
              Use 8+ characters with an uppercase letter, lowercase letter, number, and special character (for example, <code>Voyago@2026</code>).
            </p>
          </div>
          <Input id="confirm" label="Confirm Password" type="password" value={form.confirm} onChange={handleChange} placeholder="Repeat password" icon="🔒" error={errors.confirm} required />
          <Button id="register-submit-btn" type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%' }}>
            Create Account
          </Button>
        </form>

        <p className="auth__switch">
          Already have an account? <Link to="/login">Sign in →</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
