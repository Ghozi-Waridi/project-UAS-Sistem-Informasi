import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../services/authService';

const ProtectedRoute = ({ allowedRoles }) => {
  const isAuth = isAuthenticated();
  const user = getCurrentUser();
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  // tag Navigata merupakjan tag yang digunakan untuk melakukan riderect
  // jadi tanpa menggunakan tombvbol apapun langung perpindah ke url berikutnya

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'admin') {
      return <Navigate to="/beranda" replace />;
    } else if (user?.role === 'dm') {
      return <Navigate to="/dm/dashboard" replace />;
    } else {
      // Fallback for unknown roles
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
