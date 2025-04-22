import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
};