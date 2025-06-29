import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  if (!user) {
    // User is authenticated but user data is not loaded yet
    return <Navigate to="/auth/signin" replace />;
  }

  if (!roles.includes(user.role)) {
    // User doesn't have the required role
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 