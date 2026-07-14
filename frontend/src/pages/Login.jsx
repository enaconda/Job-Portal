import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // One-tap demo access using the shared enaconda / enaconda credential.
  // No OTP or email verification — logs straight in as the chosen role.
  const routeFor = (role) =>
    role === 'admin' ? '/admin' : role === 'recruiter' ? '/dashboard' : '/jobs';

  const handleDemo = async (role) => {
    setError('');
    setSubmitting(true);
    try {
      const user = await demoLogin(role);
      navigate(routeFor(user.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const id = form.email.trim();

      // Shared demo credential: typing enaconda / enaconda logs straight in.
      // A single credential can't be three roles at once, so the typed form
      // signs in as admin; use the role buttons below for recruiter/student.
      if (id.toLowerCase() === 'enaconda' && form.password === 'enaconda') {
        setShowRoles(true);
        return;
      }

      const user = await login(id, form.password);
      navigate(routeFor(user.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Log in to continue to JobBoard</p>

        {error && <div className="form-error">{error}</div>}

        <label>
          Email or username
          <input type="text" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com or enaconda" />
        </label>

        <label>
          Password
          <input type="password" name="password" required value={form.password} onChange={handleChange} placeholder="••••••••" />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
        {showRoles && (
        <div className="demo-panel">
          <div className="demo-divider"><span>or use demo access</span></div>
          <div className="demo-buttons">
            <button type="button" className="btn btn-ghost" disabled={submitting} onClick={() => handleDemo('admin')}>
              Admin
            </button>
            <button type="button" className="btn btn-ghost" disabled={submitting} onClick={() => handleDemo('recruiter')}>
              Recruiter
            </button>
            <button type="button" className="btn btn-ghost" disabled={submitting} onClick={() => handleDemo('student')}>
              Student
            </button>
          </div>
        </div>
      )}
      </form>
    </div>
  );
}
