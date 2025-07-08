export const API_BASE_URL = "https://vscode-internal-8-beta.beta01.cloud.kavia.ai:3001"; // FastAPI backend base URL

// API Endpoints mapped to backend OpenAPI spec (see backend_api_documentation.md)
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: "/auth/login", // POST (form-urlencoded, returns JWT)
  REGISTER_APPLICANT: "/auth/register/applicant", // POST (JSON)
  REGISTER_EMPLOYER: "/auth/register/employer", // POST (JSON)
  PROFILE: "/auth/me", // GET (profile), PUT (update)

  // Users listing (Admin/utility endpoints, not in UI but here for completeness)
  APPLICANTS_LIST: "/users/applicants", // GET: params skip, limit
  EMPLOYERS_LIST: "/users/employers", // GET: params skip, limit

  // Jobs & Applications (strictly per backend spec)
  JOBS: "/jobs/", // GET (list/search), POST (create job as employer)
  JOB_DETAIL: (jobId) => `/jobs/${jobId}`, // GET (detail), PUT (edit), DELETE (remove)
  JOB_APPLY: (jobId) => `/jobs/${jobId}/apply`, // POST: (apply as applicant)
  EMPLOYER_JOBS: "/jobs/me", // GET: employer's jobs
  JOB_APPLICATIONS: (jobId) => `/jobs/${jobId}/applications`, // GET: all applications for the job (employer)
  APPLICANT_APPLICATIONS: "/jobs/applications/me", // GET: seeker's own applications (applicant)
  MY_APPLICATION_ON_JOB: (jobId) => `/jobs/applications/job/${jobId}/me`, // GET: applicant's own application for a specific job
  APPLICATION_STATUS: (applicationId) => `/jobs/applications/${applicationId}/status`, // PUT: employer updates application status
};
