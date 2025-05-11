import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const auth = useSelector((state) => state.auth);
  const { user, authenticated } = auth;
  const location = useLocation();

  if (!authenticated) {
    // Not logged in, redirect to login with state to remember current location
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Logged in but role not authorized, redirect to unauthorized or home
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
