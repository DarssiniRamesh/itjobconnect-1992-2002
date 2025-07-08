import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL, API_ENDPOINTS } from "../constants";

/**
 * PUBLIC_INTERFACE
 * EmployerDashboard: Employer can create/edit jobs, see their jobs, and review applicants.
 */
function EmployerDashboard() {
  const { isAuthenticated, token } = useAuth();
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [jobForm, setJobForm] = useState({ title: "", description: "", location: "", job_type: "", keywords: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [showApplicantsFor, setShowApplicantsFor] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  // Fetch employer's jobs
  useEffect(() => {
    async function fetchJobs() {
      if (!isAuthenticated) return;
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EMPLOYER_JOBS}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      setMyJobs(Array.isArray(data) ? data : data.jobs || []);
      setLoading(false);
    }
    fetchJobs();
  }, [isAuthenticated, token]);

  function handleJobFormOpen(job = null) {
    setEditJob(job);
    setJobForm(job ? {
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      job_type: job.job_type || "",
      keywords: job.keywords || ""
    } : { title: "", description: "", location: "", job_type: "", keywords: "" });
    setFormError("");
    setShowJobForm(true);
  }

  function handleFormChange(e) {
    setJobForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleJobFormSubmit(e) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    const url = editJob
      ? `${API_BASE_URL}${API_ENDPOINTS.JOB_DETAIL(editJob.id)}`
      : `${API_BASE_URL}${API_ENDPOINTS.JOBS}`;
    const method = editJob ? "PUT" : "POST";
    // Backend expects required: title, description. Optional: location, job_type, keywords.
    let payload;
    if (editJob) {
      // Only include fields that are provided for JobUpdate schema (all optional).
      payload = {};
      ["title", "description", "location", "job_type", "keywords"].forEach(k => {
        if (jobForm[k] !== undefined && jobForm[k] !== "") payload[k] = jobForm[k];
      });
    } else {
      payload = { title: jobForm.title, description: jobForm.description };
      if (jobForm.location) payload.location = jobForm.location;
      if (jobForm.job_type) payload.job_type = jobForm.job_type;
      if (jobForm.keywords) payload.keywords = jobForm.keywords;
    }
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      setShowJobForm(false);
      // Refresh jobs
      const res2 = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EMPLOYER_JOBS}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data2 = await res2.json();
      setMyJobs(Array.isArray(data2) ? data2 : data2.jobs || []);
    } else {
      setFormError(data?.detail || data?.message || "Could not save job");
    }
    setFormLoading(false);
  }

  function JobFormModal() {
    if (!showJobForm) return null;
    return (
      <div className="modal-bg" style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.35)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div className="modal-card" style={{
          maxWidth: 470, minWidth: "56vw", background: "var(--bg-primary)", borderRadius: 10,
          boxShadow: "0 2px 18px rgba(0,0,0,0.21)", padding: 24
        }}>
          <h2 style={{ marginBottom: 14 }}>
            {editJob ? "Edit Job Posting" : "Post New Job"}
          </h2>
          <form onSubmit={handleJobFormSubmit}>
            <div style={{ marginBottom: 14 }}>
              <input type="text" className="App-input" name="title" required
                placeholder="Job Title"
                style={{ width: "100%" }}
                value={jobForm.title}
                onChange={handleFormChange}
                autoFocus
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <input type="text" className="App-input" name="location"
                placeholder="Location (optional)"
                style={{ width: "100%" }}
                value={jobForm.location}
                onChange={handleFormChange}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <input type="text" className="App-input" name="job_type"
                placeholder="Job Type (e.g. Full Time, Remote)"
                style={{ width: "100%" }}
                value={jobForm.job_type}
                onChange={handleFormChange}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <input type="text" className="App-input" name="keywords"
                placeholder="Keywords (comma-separated)"
                style={{ width: "100%" }}
                value={jobForm.keywords}
                onChange={handleFormChange}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <textarea className="App-input" name="description" required
                placeholder="Job description"
                style={{ width: "100%", minHeight: 70 }}
                value={jobForm.description}
                onChange={handleFormChange}
              />
            </div>
            <button className="btn btn-large" type="submit" disabled={formLoading}
              style={{ maxWidth: 170, marginRight: 14 }}>
              {formLoading ? "Saving…" : "Save Job"}
            </button>
            <button className="btn" type="button" onClick={() => setShowJobForm(false)}
              style={{ background: "#eee", color: "#222", maxWidth: 110 }}>
              Cancel
            </button>
            {formError && <div style={{ color: "#b45", marginTop: 14 }}>{formError}</div>}
          </form>
        </div>
      </div>
    );
  }

  async function handleShowApplicants(jobId) {
    setShowApplicantsFor(jobId);
    setApplicantsLoading(true);
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.JOB_APPLICATIONS(jobId)}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    const data = await res.json();
    setApplicants(Array.isArray(data) ? data : data.applicants || []);
    setApplicantsLoading(false);
  }

  function ApplicantsModal() {
    if (!showApplicantsFor) return null;
    return (
      <div className="modal-bg" style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.35)", zIndex: 13, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div className="modal-card" style={{
          maxWidth: 600, background: "var(--bg-primary)", borderRadius: 10,
          boxShadow: "0 2px 18px rgba(0,0,0,0.21)", padding: 18, minHeight: 210
        }}>
          <h3 style={{ margin: "4px 0 13px" }}>Applicants</h3>
          {applicantsLoading ? (
            <div style={{ color: "#888", fontStyle: "italic" }}>Fetching applicants...</div>
          ) : (
            applicants.length === 0 ? (
              <div style={{ color: "#888", fontStyle: "italic" }}>No applicants yet.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map(a => (
                    <tr key={a.id}>
                      <td style={tdStyle}>{a.name}</td>
                      <td style={tdStyle}>{a.email}</td>
                      <td style={tdStyle}>{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
          <button onClick={() => setShowApplicantsFor(null)}
            className="btn"
            style={{ marginTop: 16, width: 105, background: "#eee", color: "#222" }}
          >Close</button>
        </div>
      </div>
    );
  }

  return (
    <section className="container" style={{ padding: "2rem 0" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Employer Dashboard</h2>
      <button className="btn btn-large" style={{ marginBottom: 17, maxWidth: 180 }}
        onClick={() => handleJobFormOpen()}>
        + Post New Job
      </button>
      {loading ? (
        <div style={{ color: "#888", fontStyle: "italic" }}>Loading your jobs...</div>
      ) : (
        myJobs.length === 0 ? (
          <div style={{ color: "#888", fontStyle: "italic" }}>You haven't posted any jobs yet.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 440 }}>
              <thead style={{ background: "var(--bg-secondary)" }}>
                <tr>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Location</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Posted</th>
                  <th style={thStyle}>Applicants</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myJobs.map(job => (
                  <tr key={job.id}>
                    <td style={tdStyle}>{job.title}</td>
                    <td style={tdStyle}>{job.location || "--"}</td>
                    <td style={tdStyle}>{job.job_type || "--"}</td>
                    <td style={tdStyle}>{job.posted_at ? new Date(job.posted_at).toLocaleDateString() : "--"}</td>
                    <td style={tdStyle + { textAlign: "center" }}>
                      <button className="btn"
                        onClick={() => handleShowApplicants(job.id)}
                        style={{
                          fontSize: 14,
                          minWidth: 60,
                          padding: "6px 8px"
                        }}>
                        View
                      </button>
                    </td>
                    <td style={tdStyle}>
                      <button className="btn"
                        onClick={() => handleJobFormOpen(job)}
                        style={{
                          fontSize: 14, background: "#d9edff", color: "#155",
                          minWidth: 60, padding: "6px 8px"
                        }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
      {JobFormModal()}
      {ApplicantsModal()}
    </section>
  );
}

const thStyle = {
  padding: "8px 10px", borderBottom: "1px solid var(--border-color)", fontWeight: 600, textAlign: "left", fontSize: 15
};
const tdStyle = {
  padding: "8px 10px", borderBottom: "1px solid var(--border-color)", fontSize: 15
};

export default EmployerDashboard;
