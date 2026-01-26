import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useApp();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required and user doesn't have the right role
  if (allowedRoles.length > 0 && (!user.userRole || !allowedRoles.includes(user.userRole))) {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated and has the right role, render the component
  return children;
};

export default ProtectedRoute;