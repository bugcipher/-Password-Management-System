import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/api';

/**
 * Guarded route wrapping pages that require user login
 */
const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    // Redirect to login if user not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
