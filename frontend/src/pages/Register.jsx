import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', company: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await register(form);
      navigate(user.role === 'recruiter' ? '/dashboard' : '/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        <p className="auth-subtitle">Join as a student or a recruiter</p>

        {error && <div className="form-error">{error}</div>}

        <div className="role-toggle">
          <button
            type="button"
            className={form.role === 'student' ? 'role-option active' : 'role-option'}
            onClick={() => setForm({ ...form, role: 'student' })}
          >
            I'm a student
          </button>
          <button
            type="button"
            className={form.role === 'recruiter' ? 'role-option active' : 'role-option'}
            onClick={() => setForm({ ...form, role: 'recruiter' })}
          >
            I'm a recruiter
          </button>
        </div>

        <label>
          Full name
          <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Jordan Lee" />
        </label>

        <label>
          Email
          <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
        </label>

        <label>
          Password
          <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
        </label>

        {form.role === 'recruiter' && (
          <label>
            Company name
            <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Acme Inc." />
          </label>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
