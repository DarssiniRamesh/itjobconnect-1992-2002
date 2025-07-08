import React from 'react';

/**
 * PUBLIC_INTERFACE
 * HomePage: Landing page for the job portal.
 */
function HomePage() {
  return (
    <section className="container" style={{ padding: '3rem 0' }}>
      <h1 className="title">Welcome to IT JobConnect</h1>
      <p className="subtitle">Connecting IT talent with top tech employers.</p>
      <div style={{ margin: '2rem 0' }}>
        <a className="App-link" href="/jobs">Browse IT Jobs</a>
      </div>
      <p>Are you an employer? <a className="App-link" href="/dashboard/employer">Post a Job</a></p>
    </section>
  );
}

export default HomePage;
