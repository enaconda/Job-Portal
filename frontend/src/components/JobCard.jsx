import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job._id}`} className="job-card">
      <div className="job-card-top">
        <h3>{job.title}</h3>
        <span className="job-type-badge">{job.jobType}</span>
      </div>
      <p className="job-company">{job.company} &middot; {job.location}</p>
      <p className="job-desc-preview">{job.description.slice(0, 130)}{job.description.length > 130 ? '…' : ''}</p>
      <div className="job-card-bottom">
        <div className="skill-chips">
          {(job.skillsRequired || []).slice(0, 4).map((skill) => (
            <span key={skill} className="chip">{skill}</span>
          ))}
        </div>
        <span className="job-salary">{job.salaryRange}</span>
      </div>
    </Link>
  );
}
