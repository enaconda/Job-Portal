import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const statusColor = {
  Applied: 'status-applied',
  'Under Review': 'status-review',
  Shortlisted: 'status-shortlisted',
  Rejected: 'status-rejected',
  Hired: 'status-hired',
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/mine')
      .then(({ data }) => setApplications(data.applications))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading…</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My applications</h1>
        <p className="page-subtitle">Track the status of every job you've applied to</p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't applied to any jobs yet</h3>
          <Link to="/jobs" className="btn btn-primary">Browse open roles</Link>
        </div>
      ) : (
        <div className="applications-table">
          {applications.map((app) => (
            <div key={app._id} className="application-row">
              <div>
                <strong>{app.job?.title || 'Job removed'}</strong>
                <p className="muted">{app.job?.company} &middot; {app.job?.location}</p>
              </div>
              <span className={`status-badge ${statusColor[app.status] || ''}`}>{app.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
