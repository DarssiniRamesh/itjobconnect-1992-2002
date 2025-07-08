import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

/**
 * PUBLIC_INTERFACE
 * Navbar: Shared navigation bar with links for job seeker and employer flows, login/register,
 * and theme toggle.
 * @param {string} theme - Current theme ('light' | 'dark')
 * @param {() => void} toggleTheme - Callback to switch theme
 */
function Navbar({ theme, toggleTheme }) {
  const location = useLocation();

  // You can replace with authentication status in the future:
  const isLoggedIn = false; // Dummy, replace with real auth
  const userRole = null; // Example: 'seeker' or 'employer'

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link className="navbar-brand" to="/">
          IT JobConnect
        </Link>
        <Link className={`nav-link${location.pathname.startsWith('/jobs') ? ' active' : ''}`} to="/jobs">
          Browse Jobs
        </Link>
        {isLoggedIn && userRole === 'seeker' && (
          <Link className={`nav-link${location.pathname.startsWith('/dashboard/seeker') ? ' active' : ''}`} to="/dashboard/seeker">
            My Dashboard
          </Link>
        )}
        {isLoggedIn && userRole === 'employer' && (
          <Link className={`nav-link${location.pathname.startsWith('/dashboard/employer') ? ' active' : ''}`} to="/dashboard/employer">
            Employer Dashboard
          </Link>
        )}
      </div>
      <div className="navbar-right">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {isLoggedIn ? (
          <Link className="nav-link" to="/profile">Profile</Link>
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
