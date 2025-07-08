import React from 'react';

/**
 * PUBLIC_INTERFACE
 * RegisterPage: Registration form for new users.
 */
function RegisterPage() {
  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Create an Account</h2>
      <div style={{ fontStyle: 'italic', color: '#888' }}>
        [Registration form will be implemented here]
      </div>
      <p style={{ marginTop: '2rem' }}>Already have an account? <a className="App-link" href="/login">Log In</a></p>
    </section>
  );
}

export default RegisterPage;
