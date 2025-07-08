import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * RegisterPage: Registration form for new users.
 */
function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "seeker" });
  const [error, setError] = useState("");
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const res = await signup(form);
    if (res.success) {
      navigate("/");
    } else {
      setError(res.message || "Registration failed");
    }
  };

  return (
    <section className="container" style={{ padding: '2rem 0', maxWidth: 440, margin: "0 auto" }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            className="App-input"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 10 }}
          />
        </div>
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
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="role">Register as</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="App-input"
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 10 }}
          >
            <option value="seeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-large"
          style={{ width: "100%", marginTop: 8 }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
      </form>
      <p style={{ marginTop: '2rem' }}>
        Already have an account?{" "}
        <Link className="App-link" to="/login">Log In</Link>
      </p>
    </section>
  );
}

export default RegisterPage;
