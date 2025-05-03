import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the children components
  return children;
};

export default ProtectedRoute;
