# Job Portal — MERN Stack

A full-stack job portal connecting students and recruiters, with JWT authentication,
role-based access control, job posting/search, resume uploads, profile management,
application tracking, and a recruiter dashboard.

## Tech stack
- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt password hashing
- **File uploads:** Multer (resumes, stored locally under `backend/uploads/resumes`)

## Project structure
```
job-portal/
├── backend/
│   ├── config/db.js
│   ├── models/          # User, Job, Application
│   ├── controllers/     # auth, user, job, application logic
│   ├── routes/          # REST API routes
│   ├── middleware/      # JWT auth, role-based access, file upload
│   ├── uploads/resumes/ # uploaded resume files
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js       # axios instance with JWT interceptor
        ├── context/AuthContext.jsx
        ├── components/        # Navbar, JobCard, ProtectedRoute
        └── pages/              # Home, Login, Register, JobList, JobDetails,
                                  # PostJob, RecruiterDashboard, MyApplications, Profile
```

## Getting started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MongoDB URI and a strong JWT_SECRET
npm run dev
```
The API runs on `http://localhost:5000` by default.

### 2. Frontend setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
The app runs on `http://localhost:5173` by default and proxies `/api` and
`/uploads` requests to the backend during development.

### 3. Try it out
- Register as a **recruiter** → post a job → view applicants from the dashboard.
- Register as a **student** → upload a resume in Profile → browse jobs → apply →
  track status under My Applications.

## Core features implemented
1. JWT authentication (register/login) with bcrypt password hashing
2. Role-based access control (student vs recruiter) enforced on both API and UI
3. Job posting (recruiter)
4. Job search with keyword, location, type, and experience level filters
5. Job details view with apply flow
6. Resume upload (student, PDF/Word, 5MB limit)
7. Profile management (both roles)
8. Application tracking for students (status: Applied → Under Review →
   Shortlisted / Rejected / Hired)
9. Recruiter dashboard — manage postings, view applicants, update application status
10. Protected routes on the frontend based on auth state and role

## API overview
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Authenticated |
| GET | /api/users/profile | Authenticated |
| PUT | /api/users/profile | Authenticated |
| POST | /api/users/resume | Student |
| GET | /api/jobs | Public (search/filter/pagination) |
| GET | /api/jobs/:id | Public |
| POST | /api/jobs | Recruiter |
| PUT | /api/jobs/:id | Recruiter (owner) |
| DELETE | /api/jobs/:id | Recruiter (owner) |
| GET | /api/jobs/recruiter/mine | Recruiter |
| POST | /api/applications/:jobId | Student |
| GET | /api/applications/mine | Student |
| GET | /api/applications/job/:jobId | Recruiter (owner) |
| PUT | /api/applications/:id/status | Recruiter (owner) |

## Notes for pushing to GitHub
Both `backend/.gitignore` and `frontend/.gitignore` already exclude `node_modules`,
`.env`, and build output — so it's safe to `git init` at the project root and push
as-is. Just remember to fill in your own `.env` files locally (they're not committed).
