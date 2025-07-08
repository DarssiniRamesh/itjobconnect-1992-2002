import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * Navbar: Shared navigation bar with links for job seeker and employer flows, login/register,
 * and theme toggle. Now supports login/logout logic and role-based links.
 * @param {string} theme - Current theme ('light' | 'dark')
 * @param {() => void} toggleTheme - Callback to switch theme
 */
function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, role, logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link className="navbar-brand" to="/">
          IT JobConnect
        </Link>
        <Link className={`nav-link${location.pathname.startsWith('/jobs') ? ' active' : ''}`} to="/jobs">
          Browse Jobs
        </Link>
        {isAuthenticated && role === 'seeker' && (
          <Link className={`nav-link${location.pathname.startsWith('/dashboard/seeker') ? ' active' : ''}`} to="/dashboard/seeker">
            My Dashboard
          </Link>
        )}
        {isAuthenticated && role === 'employer' && (
          <Link className={`nav-link${location.pathname.startsWith('/dashboard/employer') ? ' active' : ''}`} to="/dashboard/employer">
            Employer Dashboard
          </Link>
        )}
      </div>
      <div className="navbar-right">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {isAuthenticated ? (
          <>
            <Link className="nav-link" to="/profile">
              {user?.name ? user.name : "Profile"}
            </Link>
            <a className="nav-link" href="/" onClick={handleLogout}>Logout</a>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
