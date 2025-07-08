import React from 'react';

/**
 * PUBLIC_INTERFACE
 * LoginPage: Login form for job seekers and employers.
 */
function LoginPage() {
  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Sign In</h2>
      <div style={{ fontStyle: 'italic', color: '#888' }}>
        [Login form will be implemented here]
      </div>
      <p style={{ marginTop: '2rem' }}>Don't have an account? <a className="App-link" href="/register">Register</a></p>
    </section>
  );
}

export default LoginPage;
