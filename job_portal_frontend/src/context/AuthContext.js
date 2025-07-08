import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL, API_ENDPOINTS } from "../constants";
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
    // The FastAPI backend expects x-www-form-urlencoded for login
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const data = await res.json();

    if (res.ok && data.access_token) {
      // Get user info from /auth/me to fetch profile & role after login
      const meRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROFILE}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          "Content-Type": "application/json"
        }
      });
      if (meRes.ok) {
        const userInfo = await meRes.json();
        // For both applicant and employer, backend profile includes "role" ("applicant"/"employer" or "seeker"/"employer")
        const userRole = userInfo.company_name !== undefined ? "employer" : "seeker";
        setToken(data.access_token);
        setUser(userInfo);
        setRole(userRole);
        localStorage.setItem("jwt", data.access_token);
        localStorage.setItem("user", JSON.stringify(userInfo));
        localStorage.setItem("role", userRole);
        setLoading(false);
        return { success: true };
      }
      setLoading(false);
      return { success: false, message: "Could not retrieve user profile" };
    } else {
      setToken(null);
      setUser(null);
      setRole(null);
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setLoading(false);
      return { success: false, message: data?.detail || "Login failed" };
    }
  };

  // PUBLIC_INTERFACE
  const signup = async ({ name, email, password, role }) => {
    setLoading(true);
    // endpoint depends on role (applicant | employer)
    let url;
    let payload;
    if (role === "employer") {
      url = `${API_BASE_URL}${API_ENDPOINTS.REGISTER_EMPLOYER}`;
      payload = { name, email, password }; // Only "name", "email", "password" are required, company_name, company_website can be added as needed
    } else {
      url = `${API_BASE_URL}${API_ENDPOINTS.REGISTER_APPLICANT}`;
      payload = { name, email, password }; // summary, skills, experience are optional and can be extended from frontend form if desired
    }
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok && data.access_token) {
      // Fetch user info as with login
      const meRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROFILE}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          "Content-Type": "application/json"
        }
      });
      if (meRes.ok) {
        const userInfo = await meRes.json();
        const userRole = userInfo.company_name !== undefined ? "employer" : "seeker";
        setToken(data.access_token);
        setUser(userInfo);
        setRole(userRole);
        localStorage.setItem("jwt", data.access_token);
        localStorage.setItem("user", JSON.stringify(userInfo));
        localStorage.setItem("role", userRole);
        setLoading(false);
        return { success: true };
      }
      setLoading(false);
      return { success: false, message: "Could not fetch user profile after registration." };
    } else {
      setToken(null);
      setUser(null);
      setRole(null);
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setLoading(false);
      return { success: false, message: data?.detail || "Registration failed" };
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
