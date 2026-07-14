import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || '',
    bio: user.bio || '',
    skills: (user.skills || []).join(', '),
    education: user.education || '',
    company: user.company || '',
    companyWebsite: user.companyWebsite || '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [message, setMessage] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage('');
    try {
      const payload = { ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) };
      const { data } = await api.put('/users/profile', payload);
      updateUser(data.user);
      setMessage('success:Profile updated successfully.');
    } catch (err) {
      setMessage(`error:${err.response?.data?.message || 'Failed to update profile.'}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    setUploadingResume(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      const { data } = await api.post('/users/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(data.user);
      setMessage('success:Resume uploaded successfully.');
    } catch (err) {
      setMessage(`error:${err.response?.data?.message || 'Resume upload failed.'}`);
    } finally {
      setUploadingResume(false);
    }
  };

  const [status, text] = message.includes(':') ? message.split(':') : [null, null];

  return (
    <div className="page-container narrow">
      <div className="page-header">
        <h1>My profile</h1>
        <p className="page-subtitle">Keep your details up to date</p>
      </div>

      {status && <div className={status === 'success' ? 'form-success' : 'form-error'}>{text}</div>}

      <form className="form-card" onSubmit={handleProfileSubmit}>
        <label>
          Full name
          <input type="text" name="name" value={form.name} onChange={handleChange} />
        </label>

        <label>
          Bio
          <textarea name="bio" rows={3} value={form.bio} onChange={handleChange} placeholder="A short intro about you" />
        </label>

        {user.role === 'student' && (
          <>
            <label>
              Skills (comma separated)
              <input type="text" name="skills" value={form.skills} onChange={handleChange} placeholder="JavaScript, React, SQL" />
            </label>
            <label>
              Education
              <input type="text" name="education" value={form.education} onChange={handleChange} placeholder="B.Tech CSE, XYZ University" />
            </label>
          </>
        )}

        {user.role === 'recruiter' && (
          <>
            <label>
              Company
              <input type="text" name="company" value={form.company} onChange={handleChange} />
            </label>
            <label>
              Company website
              <input type="text" name="companyWebsite" value={form.companyWebsite} onChange={handleChange} placeholder="https://example.com" />
            </label>
          </>
        )}

        <button type="submit" className="btn btn-primary" disabled={savingProfile}>
          {savingProfile ? 'Saving…' : 'Save profile'}
        </button>
      </form>

      {user.role === 'student' && (
        <form className="form-card" onSubmit={handleResumeUpload}>
          <h3>Resume</h3>
          {user.resumeUrl ? (
            <p className="muted">
              Current resume: <a href={`http://localhost:5000${user.resumeUrl}`} target="_blank" rel="noreferrer">View uploaded resume</a>
            </p>
          ) : (
            <p className="muted">No resume uploaded yet. You'll need one before applying to jobs.</p>
          )}
          <label>
            Upload new resume (PDF or Word, max 5MB)
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} />
          </label>
          <button type="submit" className="btn btn-primary" disabled={!resumeFile || uploadingResume}>
            {uploadingResume ? 'Uploading…' : 'Upload resume'}
          </button>
        </form>
      )}
    </div>
  );
}
