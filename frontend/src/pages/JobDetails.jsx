import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => setJob(data.job))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setApplying(true);
    setApplyMessage('');
    try {
      await api.post(`/applications/${id}`, { coverLetter });
      setApplyMessage('success:Application submitted! You can track its status under My Applications.');
    } catch (err) {
      setApplyMessage(`error:${err.response?.data?.message || 'Something went wrong. Please try again.'}`);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="page-loading">Loading…</div>;
  if (!job) return <div className="empty-state"><h3>Job not found</h3></div>;

  const [status, message] = applyMessage.includes(':') ? applyMessage.split(':') : [null, null];

  return (
    <div className="page-container narrow">
      <div className="job-detail-header">
        <h1>{job.title}</h1>
        <p className="job-company">{job.company} &middot; {job.location} &middot; {job.jobType}</p>
        <div className="skill-chips">
          {(job.skillsRequired || []).map((skill) => <span key={skill} className="chip">{skill}</span>)}
        </div>
      </div>

      <div className="job-detail-meta">
        <div><span className="meta-label">Salary</span><span>{job.salaryRange}</span></div>
        <div><span className="meta-label">Experience</span><span>{job.experienceLevel}</span></div>
      </div>

      <div className="job-detail-body">
        <h3>About this role</h3>
        <p>{job.description}</p>
      </div>

      {user?.role === 'student' && (
        <form className="apply-box" onSubmit={handleApply}>
          <h3>Apply to this job</h3>
          <textarea
            placeholder="Add a short cover letter (optional)"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={4}
          />
          {status && <div className={status === 'success' ? 'form-success' : 'form-error'}>{message}</div>}
          <button type="submit" className="btn btn-primary" disabled={applying}>
            {applying ? 'Submitting…' : 'Apply now'}
          </button>
        </form>
      )}

      {!user && (
        <div className="apply-box">
          <p>Log in as a student to apply for this job.</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Log in to apply</button>
        </div>
      )}
    </div>
  );
}
