import React, { createContext, useContext, useState, useEffect } from "react";

// AuthContext to provide authentication state and actions throughout the app
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// PUBLIC_INTERFACE
/**
 * AuthProvider manages authentication (JWT, role, user) state, login/signup/logout, and exposes guards/utilities.
 *
 * - Stores JWT and user info in localStorage for session persistence.
 * - Exposes login, signup, and logout functions.
 * - Allows role-based rendering/guards via isAuthenticated and userRole.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { email, name, role }
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on initial mount
  useEffect(() => {
    const jwt = localStorage.getItem("jwt") || null;
    const userInfo = localStorage.getItem("user");
    const r = localStorage.getItem("role");
    if (jwt && userInfo && r) {
      setToken(jwt);
      setUser(JSON.parse(userInfo));
      setRole(r);
    }
    setLoading(false);
  }, []);

  // PUBLIC_INTERFACE
  const login = async ({ email, password }) => {
    setLoading(true);
    // TODO: Replace with actual backend URL
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      setRole(data.user.role);
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);
      setLoading(false);
      return { success: true };
    } else {
      setToken(null);
      setUser(null);
      setRole(null);
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setLoading(false);
      return { success: false, message: data?.message || "Login failed" };
    }
  };

  // PUBLIC_INTERFACE
  const signup = async ({ name, email, password, role }) => {
    setLoading(true);
    // TODO: Replace with actual backend URL
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (res.ok && data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      setRole(data.user.role);
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);
      setLoading(false);
      return { success: true };
    } else {
      setToken(null);
      setUser(null);
      setRole(null);
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setLoading(false);
      return { success: false, message: data?.message || "Registration failed" };
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setToken(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  const value = {
    user,
    token,
    role,
    loading,
    isAuthenticated: !!token,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
