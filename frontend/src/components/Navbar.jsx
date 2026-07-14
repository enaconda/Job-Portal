import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">JB</span>
          <span>JobBoard</span>
        </Link>

        <nav className="nav-links">
          <Link to="/jobs">Browse jobs</Link>

          {user && user.role === 'student' && (
            <>
              <Link to="/applications">My applications</Link>
              <Link to="/profile">Profile</Link>
            </>
          )}

          {user && user.role === 'recruiter' && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/post-job">Post a job</Link>
              <Link to="/profile">Profile</Link>
            </>
          )}

          {user && user.role === 'admin' && (
            <Link to="/admin">Admin console</Link>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-chip">
                {user.name} <span className="role-tag">{user.role}</span>
              </span>
              <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Log in</Link>
              <Link to="/register" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
