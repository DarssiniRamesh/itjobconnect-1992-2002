import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL, API_ENDPOINTS } from "../constants";

/**
 * PUBLIC_INTERFACE
 * JobsPage: Job search, filtering, listing, and job detail apply modal for seekers.
 */
function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyStatus, setApplyStatus] = useState(null);
  const { isAuthenticated, token, role } = useAuth();

  // Fetch jobs with optional search and location
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      let url = `${API_BASE_URL}${API_ENDPOINTS.JOBS}`;
      const params = [];
      if (search) params.push(`query=${encodeURIComponent(search)}`);
      if (location) params.push(`location=${encodeURIComponent(location)}`);
      if (params.length > 0) url += "?" + params.join("&");
      const res = await fetch(url);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : data.jobs || []);
      setLoading(false);
    }
    fetchJobs();
  }, [search, location]);

  // PUBLIC_INTERFACE
  const handleApply = async (jobId, answers = null) => {
    if (!isAuthenticated || role !== "seeker") {
      setApplyStatus({ error: "You must be logged in as a job seeker to apply." });
      return;
    }
    setApplyStatus({ sending: true });
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.JOB_APPLY(jobId)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      // FastAPI expects {cover_letter}, adapt accordingly if frontend supports more info
      body: JSON.stringify({ cover_letter: answers }),
    });
    const data = await res.json();
    if (res.ok) {
      setApplyStatus({ success: "Application sent!" });
      setSelectedJob(null);
    } else {
      setApplyStatus({ error: data?.detail || data?.message || "Could not apply." });
    }
  };

  function renderJobDetailModal() {
    if (!selectedJob) return null;
    return (
      <div className="modal-bg" style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.35)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div className="modal-card" style={{
          maxWidth: 460, background: "var(--bg-primary)", borderRadius: 10,
          boxShadow: "0 2px 18px rgba(0,0,0,0.23)", padding: 24
        }}>
          <h3 style={{ margin: "0 0 8px 0" }}>{selectedJob.title}</h3>
          <span style={{ fontSize: 13, color: "#6a6" }}>{selectedJob.location}</span>
          <div style={{ margin: "1rem 0" }}>
            <strong>Company:</strong> {selectedJob.company} <br />
            <strong>Salary:</strong> {selectedJob.salary ?? "Negotiable"}
          </div>
          <div style={{ margin: "1rem 0", color: "#444" }}>{selectedJob.description}</div>
          {role === "seeker" ?
            <button className="btn btn-large"
              onClick={() => handleApply(selectedJob.id)}
              disabled={applyStatus && applyStatus.sending}
              style={{ marginTop: 10, width: "100%" }}
            >Apply Now</button>
            :
            <span style={{ color: "#b47", fontStyle: "italic" }}>
              {isAuthenticated ? "Employers cannot apply." : "Login as a seeker to apply."}
            </span>
          }
          <button
            className="btn"
            style={{ marginTop: 12, width: "100%", background: "#ddd", color: "#222" }}
            onClick={() => setSelectedJob(null)}
          >Close</button>
        </div>
      </div>
    );
  }

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2 style={{ marginBottom: '1.3rem' }}>Find IT Jobs</h2>
      <form onSubmit={e => e.preventDefault()} style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <input
          className="App-input"
          type="text"
          placeholder="Keyword (e.g., React, Python)"
          value={search}
          style={{ flex: "2 1 150px", minWidth: 130, maxWidth: 260 }}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          className="App-input"
          type="text"
          placeholder="Location (e.g., Remote, New York)"
          value={location}
          style={{ flex: "1 1 120px", minWidth: 120, maxWidth: 180 }}
          onChange={e => setLocation(e.target.value)}
        />
        <button className="btn" type="submit"
          style={{ minWidth: 90, padding: "8px 10px", fontSize: 15 }}
        >Search</button>
      </form>
      {applyStatus?.error && <div style={{ color: "#ac0000", margin: "12px 0" }}>{applyStatus.error}</div>}
      {applyStatus?.success && <div style={{ color: "#25b525", margin: "12px 0" }}>{applyStatus.success}</div>}
      {loading ? (
        <div style={{ fontStyle: "italic", color: "#888" }}>Loading jobs...</div>
      ) : (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "1.5rem"
          }}>
            {jobs.length === 0 ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#999" }}>
                No jobs found.
              </div>
            ) : (
              jobs.map(job => (
                <div key={job.id}
                  style={{
                    border: "1px solid var(--border-color)",
                    borderRadius: 8,
                    background: "var(--bg-secondary)",
                    padding: 18,
                    textAlign: "left",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                  }}>
                  <h3 style={{ margin: "0 0 3px 0", fontSize: 18 }}>
                    {job.title}
                  </h3>
                  <div style={{ color: "#246", fontSize: 15 }}>{job.company} • {job.location}</div>
                  <div style={{ margin: "7px 0 12px", fontSize: 14, minHeight: 30, color: "#555" }}>
                    {job.description.slice(0, 90)}{job.description.length > 90 && "..."}
                  </div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 9 }}>
                    Posted: {job.posted_date || "N/A"}
                  </div>
                  <button
                    className="btn"
                    style={{ width: "100%" }}
                    onClick={() => setSelectedJob(job)}
                  >View Details &amp; Apply</button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {renderJobDetailModal()}
    </section>
  );
}

export default JobsPage;
