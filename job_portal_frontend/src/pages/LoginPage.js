import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * LoginPage: Login form for job seekers and employers.
 */
function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const res = await login(form);
    if (res.success) {
      // Optional: redirect by user role
      navigate("/");
    } else {
      setError(res.message || "Invalid credentials");
    }
  };

  return (
    <section className="container" style={{ padding: '2rem 0', maxWidth: 400, margin: "0 auto" }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            className="App-input"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 10 }}
            autoFocus
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="App-input"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 10 }}
          />
        </div>
        <button
          type="submit"
          className="btn btn-large"
          style={{ width: "100%", marginTop: 8 }}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
      </form>
      <p style={{ marginTop: '2rem' }}>
        Don't have an account?{" "}
        <Link className="App-link" to="/register">Register</Link>
      </p>
    </section>
  );
}

export default LoginPage;
