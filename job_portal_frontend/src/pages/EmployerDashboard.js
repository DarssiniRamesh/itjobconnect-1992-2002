import React from 'react';

/**
 * PUBLIC_INTERFACE
 * EmployerDashboard: Dashboard for employers to post and manage jobs.
 */
function EmployerDashboard() {
  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Employer Dashboard</h2>
      <div style={{ fontStyle: 'italic', color: '#888' }}>
        [Job posting and applicant management goes here]
      </div>
    </section>
  );
}

export default EmployerDashboard;
