import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL, API_ENDPOINTS } from "../constants";

/**
 * PUBLIC_INTERFACE
 * SeekerDashboard: Dashboard for job seekers to view their applications and status.
 */
function SeekerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    async function fetchApplications() {
      if (!isAuthenticated) return;
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.APPLICANT_APPLICATIONS}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : data.applications || []);
      setLoading(false);
    }
    fetchApplications();
  }, [isAuthenticated, token]);

  return (
    <section className="container" style={{ padding: "2rem 0" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>My Applications</h2>
      {loading ? (
        <div style={{ fontStyle: "italic", color: "#888" }}>
          Loading applications...
        </div>
      ) : (
        applications.length === 0 ? (
          <div style={{ color: "#888", fontStyle: "italic" }}>
            You have not applied for any jobs yet.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 420
            }}>
              <thead style={{ background: "var(--bg-secondary)" }}>
                <tr>
                  <th style={thStyle}>Job Title</th>
                  <th style={thStyle}>Company</th>
                  <th style={thStyle}>Applied On</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td style={tdStyle}>{app.job_title || "--"}</td>
                    <td style={tdStyle}>{app.company || "--"}</td>
                    <td style={tdStyle}>{app.applied_date || "--"}</td>
                    <td style={{ ...tdStyle, color: getStatusColor(app.status) }}>
                      {app.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </section>
  );
}

const thStyle = {
  padding: "8px 10px", borderBottom: "1px solid var(--border-color)", fontWeight: 600, textAlign: "left", fontSize: 15
};
const tdStyle = {
  padding: "8px 10px", borderBottom: "1px solid var(--border-color)", fontSize: 15
};

function getStatusColor(status) {
  if (!status) return "#888";
  if (status.match(/reject/i)) return "#b45";
  if (status.match(/shortlist|progress|selected/i)) return "#27AE60";
  if (status.match(/pending|applied/i)) return "#888";
  return "#246";
}

export default SeekerDashboard;
