import React from 'react';

/**
 * PUBLIC_INTERFACE
 * SeekerDashboard: Dashboard for job applicants.
 */
function SeekerDashboard() {
  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Seeker Dashboard</h2>
      <div style={{ fontStyle: 'italic', color: '#888' }}>
        [Applications, saved jobs, and recommendations go here]
      </div>
    </section>
  );
}

export default SeekerDashboard;
