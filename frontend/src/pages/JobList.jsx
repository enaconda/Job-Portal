import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import JobCard from '../components/JobCard';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', location: '', jobType: '', experienceLevel: '' });

  const fetchJobs = useCallback(async (targetPage = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page: targetPage, limit: 9 };
      Object.keys(params).forEach((key) => !params[key] && delete params[key]);
      const { data } = await api.get('/jobs', { params });
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
      setPage(data.page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    fetchJobs(1);
  }, [fetchJobs]);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Find your next role</h1>
        <p className="page-subtitle">{total} open position{total !== 1 ? 's' : ''} across the platform</p>
      </div>

      <form className="filter-bar" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          name="search"
          placeholder="Search by title, skill, or keyword"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <select name="jobType" value={filters.jobType} onChange={handleFilterChange}>
          <option value="">All types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>
        <select name="experienceLevel" value={filters.experienceLevel} onChange={handleFilterChange}>
          <option value="">All levels</option>
          <option value="Entry">Entry</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
        </select>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {loading ? (
        <div className="page-loading">Loading jobs…</div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <h3>No jobs match your search</h3>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <>
          <div className="job-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          {pages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => fetchJobs(page - 1)} className="btn btn-ghost">Previous</button>
              <span>Page {page} of {pages}</span>
              <button disabled={page >= pages} onClick={() => fetchJobs(page + 1)} className="btn btn-ghost">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
