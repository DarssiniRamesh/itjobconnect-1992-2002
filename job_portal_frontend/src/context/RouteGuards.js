import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// PUBLIC_INTERFACE
/**
 * PrivateRoute restricts access to authenticated users only.
 * If not authenticated, redirects to login.
 */
export function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// PUBLIC_INTERFACE
/**
 * RoleGuard restricts access to users with a specific role.
 * @param {string|string[]} allowedRoles
 */
export function RoleGuard({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return null;

  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!allowed.includes(role)) return <Navigate to="/" />;
  return children;
}
