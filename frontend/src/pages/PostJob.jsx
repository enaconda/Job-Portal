import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '', description: '', location: '', jobType: 'Full-time',
    skillsRequired: '', salaryRange: '', experienceLevel: 'Entry',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        skillsRequired: form.skillsRequired.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const { data } = await api.post('/jobs', payload);
      navigate(`/jobs/${data.job._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container narrow">
      <div className="page-header">
        <h1>Post a new job</h1>
        <p className="page-subtitle">Reach students actively looking for opportunities</p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <label>
          Job title
          <input type="text" name="title" required value={form.title} onChange={handleChange} placeholder="Frontend Engineer Intern" />
        </label>

        <label>
          Description
          <textarea name="description" required rows={6} value={form.description} onChange={handleChange} placeholder="Responsibilities, requirements, what makes this role great…" />
        </label>

        <div className="form-row">
          <label>
            Location
            <input type="text" name="location" required value={form.location} onChange={handleChange} placeholder="Remote / Bengaluru" />
          </label>
          <label>
            Job type
            <select name="jobType" value={form.jobType} onChange={handleChange}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            Experience level
            <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange}>
              <option>Entry</option>
              <option>Mid</option>
              <option>Senior</option>
            </select>
          </label>
          <label>
            Salary range
            <input type="text" name="salaryRange" value={form.salaryRange} onChange={handleChange} placeholder="₹6-10 LPA" />
          </label>
        </div>

        <label>
          Skills required (comma separated)
          <input type="text" name="skillsRequired" value={form.skillsRequired} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Posting…' : 'Post job'}
        </button>
      </form>
    </div>
  );
}
