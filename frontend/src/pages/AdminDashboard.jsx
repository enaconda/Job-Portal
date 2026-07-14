import { useState, useEffect } from 'react';
import api from '../api/axios';

const EMPTY_JOB = {
  title: '',
  company: '',
  location: '',
  jobType: 'Full-time',
  experienceLevel: 'Entry',
  salaryRange: '',
  skillsRequired: '',
  description: '',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState(EMPTY_JOB);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadAll = async () => {
    const [statsRes, jobsRes, pendingRes] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/jobs'),
      api.get('/admin/recruiters/pending'),
    ]);
    setStats(statsRes.data.stats);
    setJobs(jobsRes.data.jobs);
    setPending(pendingRes.data.recruiters);
  };

  useEffect(() => {
    loadAll().finally(() => setLoading(false));
  }, []);

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job and all its applications? This cannot be undone.')) return;
    await api.delete(`/admin/jobs/${id}`);
    setJobs((prev) => prev.filter((j) => j._id !== id));
    setStats((s) => s && { ...s, totalJobs: s.totalJobs - 1 });
  };

  const handleApprove = async (id) => {
    await api.put(`/admin/recruiters/${id}/approve`);
    setPending((prev) => prev.filter((r) => r._id !== id));
    setStats((s) => s && { ...s, pendingRecruiterApprovals: s.pendingRecruiterApprovals - 1 });
  };

  const handleFormChange = (e) =>
    setNewJob({ ...newJob, [e.target.name]: e.target.value });

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const { data } = await api.post('/admin/jobs', newJob);
      // Refresh so counts + applicant totals stay accurate.
      await loadAll();
      setNewJob(EMPTY_JOB);
      setShowForm(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not create job.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loading">Loading admin console…</div>;

  const statCards = [
    { label: 'Total students', value: stats.totalStudents, tone: 'primary' },
    { label: 'Total recruiters', value: stats.totalRecruiters, tone: 'primary' },
    { label: 'Total jobs', value: stats.totalJobs, tone: 'ink' },
    { label: 'Active jobs', value: stats.activeJobs, tone: 'success' },
    { label: 'Total applications', value: stats.totalApplications, tone: 'ink' },
    { label: 'Pending approvals', value: stats.pendingRecruiterApprovals, tone: 'amber' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin console</h1>
        <p className="page-subtitle">Platform overview and management</p>
      </div>

      {/* Stat cards */}
      <div className="admin-stats">
        {statCards.map((c) => (
          <div key={c.label} className={`admin-stat admin-stat-${c.tone}`}>
            <span className="admin-stat-value">{c.value}</span>
            <span className="admin-stat-label">{c.label}</span>
          </div>
        ))}
      </div>

      {/* Pending recruiter approvals */}
      <section className="admin-section">
        <div className="admin-section-head">
          <h2>Pending recruiter approvals</h2>
          <span className="count-pill">{pending.length}</span>
        </div>
        {pending.length === 0 ? (
          <p className="muted">No recruiters waiting for approval.</p>
        ) : (
          <div className="admin-table">
            {pending.map((r) => (
              <div key={r._id} className="admin-row">
                <div>
                  <strong>{r.name}</strong>
                  <span className="muted"> · {r.email}</span>
                  {r.company && <span className="muted"> · {r.company}</span>}
                </div>
                <button className="btn btn-primary" onClick={() => handleApprove(r._id)}>
                  Approve
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Job management */}
      <section className="admin-section">
        <div className="admin-section-head">
          <h2>All jobs</h2>
          <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Close' : '+ Add job'}
          </button>
        </div>

        {showForm && (
          <form className="admin-job-form" onSubmit={handleCreateJob}>
            {formError && <div className="form-error">{formError}</div>}
            <div className="admin-form-grid">
              <label>Title
                <input name="title" value={newJob.title} onChange={handleFormChange} required />
              </label>
              <label>Company
                <input name="company" value={newJob.company} onChange={handleFormChange} required />
              </label>
              <label>Location
                <input name="location" value={newJob.location} onChange={handleFormChange} required />
              </label>
              <label>Salary range
                <input name="salaryRange" value={newJob.salaryRange} onChange={handleFormChange} placeholder="e.g. ₹6–9 LPA" />
              </label>
              <label>Job type
                <select name="jobType" value={newJob.jobType} onChange={handleFormChange}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>
              </label>
              <label>Experience
                <select name="experienceLevel" value={newJob.experienceLevel} onChange={handleFormChange}>
                  <option>Entry</option>
                  <option>Mid</option>
                  <option>Senior</option>
                </select>
              </label>
            </div>
            <label>Skills (comma separated)
              <input name="skillsRequired" value={newJob.skillsRequired} onChange={handleFormChange} placeholder="React, Node.js, MongoDB" />
            </label>
            <label>Description
              <textarea name="description" rows={4} value={newJob.description} onChange={handleFormChange} required />
            </label>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Creating…' : 'Create job'}
            </button>
          </form>
        )}

        {jobs.length === 0 ? (
          <p className="muted">No jobs posted yet.</p>
        ) : (
          <div className="admin-table">
            {jobs.map((job) => (
              <div key={job._id} className="admin-row">
                <div>
                  <strong>{job.title}</strong>
                  <span className="muted"> · {job.company} · {job.location}</span>
                  <div className="admin-row-meta">
                    <span className={`status-dot ${job.isActive ? 'on' : 'off'}`} />
                    {job.isActive ? 'Active' : 'Closed'} · {job.applicants} applicant{job.applicants === 1 ? '' : 's'}
                    {job.postedBy?.name && <> · by {job.postedBy.name}</>}
                  </div>
                </div>
                <button className="btn btn-ghost danger" onClick={() => handleDeleteJob(job._id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
