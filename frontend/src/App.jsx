import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import RecruiterDashboard from './pages/RecruiterDashboard';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          <Route path="/post-job" element={
            <ProtectedRoute roles={['recruiter']}><PostJob /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>
          } />

          <Route path="/applications" element={
            <ProtectedRoute roles={['student']}><MyApplications /></ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />

          <Route path="*" element={<div className="page-container"><h2>Page not found</h2></div>} />
        </Routes>
      </main>
    </AuthProvider>
  );
}
