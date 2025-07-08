export const API_BASE_URL = "https://vscode-internal-8-beta.beta01.cloud.kavia.ai:3001"; // FastAPI backend base URL

// API Endpoints mapped to backend spec
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER_APPLICANT: "/auth/register/applicant",
  REGISTER_EMPLOYER: "/auth/register/employer",
  PROFILE: "/auth/me",

  // Jobs & Applications
  JOBS: "/jobs/",
  JOB_DETAIL: (jobId) => `/jobs/${jobId}`,
  JOB_APPLY: (jobId) => `/jobs/${jobId}/apply`,
  EMPLOYER_JOBS: "/jobs/me", // Employer's own jobs
  JOB_APPLICATIONS: (jobId) => `/jobs/${jobId}/applications`, // applications for a given job (employer)
  APPLICANT_APPLICATIONS: "/jobs/applications/me", // Seeker's own applications
};
