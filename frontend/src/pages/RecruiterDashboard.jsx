import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [applicants, setApplicants] = useState({});

  useEffect(() => {
    api.get('/jobs/recruiter/mine')
      .then(({ data }) => setJobs(data.jobs))
      .finally(() => setLoading(false));
  }, []);

  const toggleApplicants = async (jobId) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
      return;
    }
    setExpandedJob(jobId);
    if (!applicants[jobId]) {
      const { data } = await api.get(`/applications/job/${jobId}`);
      setApplicants((prev) => ({ ...prev, [jobId]: data.applications }));
    }
  };

  const updateStatus = async (applicationId, jobId, status) => {
    await api.put(`/applications/${applicationId}/status`, { status });
    setApplicants((prev) => ({
      ...prev,
      [jobId]: prev[jobId].map((a) => (a._id === applicationId ? { ...a, status } : a)),
    }));
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Delete this job posting? This cannot be undone.')) return;
    await api.delete(`/jobs/${jobId}`);
    setJobs((prev) => prev.filter((j) => j._id !== jobId));
  };

  if (loading) return <div className="page-loading">Loading dashboard…</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Recruiter dashboard</h1>
        <p className="page-subtitle">Manage your postings and review applicants</p>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't posted any jobs yet</h3>
          <Link to="/post-job" className="btn btn-primary">Post your first job</Link>
        </div>
      ) : (
        <div className="dashboard-list">
          {jobs.map((job) => (
            <div key={job._id} className="dashboard-job-card">
              <div className="dashboard-job-top">
                <div>
                  <h3>{job.title}</h3>
                  <p className="job-company">{job.location} &middot; {job.jobType} &middot; {job.isActive ? 'Active' : 'Closed'}</p>
                </div>
                <div className="dashboard-job-actions">
                  <button className="btn btn-ghost" onClick={() => toggleApplicants(job._id)}>
                    {expandedJob === job._id ? 'Hide applicants' : 'View applicants'}
                  </button>
                  <button className="btn btn-ghost danger" onClick={() => deleteJob(job._id)}>Delete</button>
                </div>
              </div>

              {expandedJob === job._id && (
                <div className="applicants-list">
                  {!applicants[job._id] ? (
                    <p>Loading applicants…</p>
                  ) : applicants[job._id].length === 0 ? (
                    <p className="muted">No applicants yet.</p>
                  ) : (
                    applicants[job._id].map((app) => (
                      <div key={app._id} className="applicant-row">
                        <div>
                          <strong>{app.applicant.name}</strong>
                          <span className="muted"> &middot; {app.applicant.email}</span>
                          {app.applicant.resumeUrl && (
                            <a href={`http://localhost:5000${app.applicant.resumeUrl}`} target="_blank" rel="noreferrer" className="resume-link">
                              View resume
                            </a>
                          )}
                        </div>
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app._id, job._id, e.target.value)}
                        >
                          <option>Applied</option>
                          <option>Under Review</option>
                          <option>Shortlisted</option>
                          <option>Rejected</option>
                          <option>Hired</option>
                        </select>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
