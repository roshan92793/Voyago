import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../Loader/Loader';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullscreen message="Authenticating..." />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
