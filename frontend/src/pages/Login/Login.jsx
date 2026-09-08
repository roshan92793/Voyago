import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
        <h1 className="auth__title">Welcome back</h1>
        <p className="auth__sub">Sign in to continue your journey.</p>

        {error && <div className="auth__error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth__form">
          <Input
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            icon="📧"
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Your password"
            icon="🔒"
            required
          />
          <div className="auth__forgot">
            <a href="#">Forgot password?</a>
          </div>
          <Button
            id="login-submit-btn"
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            style={{ width: '100%' }}
          >
            Sign In
          </Button>
        </form>

        <p className="auth__switch">
          Don&apos;t have an account? <Link to="/register">Sign up free →</Link>
        </p>

        {/* Demo hint */}
        <div className="auth__demo">
          <span>🧪 Demo:</span> any email + password works when backend is running
        </div>
      </div>
    </div>
  );
};

export default Login;
