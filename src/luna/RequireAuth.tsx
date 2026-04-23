import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isLoggedIn } from './auth';

export const RequireAuth: React.FC = () => {
  const loc = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }
  return <Outlet />;
};

export default RequireAuth;