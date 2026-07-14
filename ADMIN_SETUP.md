# Admin Panel — What was added & how to run

This document covers the admin panel and demo-login additions layered on top of
your existing MERN job portal. Nothing in the original student/recruiter flow was
removed — only extended.

## Demo / bypass logins (no OTP)

Your project never had an OTP step — login was already plain email + password →
JWT. To give you instant access as any role using one shared credential, a
**demo login** was added.

Credentials (same for all three roles):

- **Username:** `enaconda`
- **Password:** `enaconda`

On the **Login page** there's now an *"or use demo access"* panel with three
buttons — **Admin**, **Recruiter**, **Student**. Clicking one signs you in
instantly as a synthetic user of that role. No account is created in the
database and no OTP/email verification runs.

How it works: `POST /api/auth/demo` checks the shared credential and issues a
JWT carrying `{ role, bypass: true }`. The `protect` middleware sees the
`bypass` flag and builds a synthetic user in memory instead of querying MongoDB.
The synthetic users have fixed valid ObjectIds so anything they create (e.g. an
admin-posted job's `postedBy`) stays well-formed. This is for demo/dev use.

## Admin console (`/admin`)

Visible in the navbar as **"Admin console"** when logged in as admin. Shows:

**Stat cards**
- Total Students
- Total Recruiters
- Total Jobs
- Active Jobs
- Total Applications
- Pending Recruiter Approvals

**Pending recruiter approvals** — list of recruiters awaiting approval, each with
an **Approve** button.

**All jobs** — every job in the system with its status and applicant count. You
can **Add job** (a form) or **Remove** any job (also deletes that job's
applications). Extra touches added on top of your list: applicant counts per job,
and a **Delete user** endpoint (`DELETE /api/admin/users/:id`) that also cleans
up the user's jobs/applications.

## Recruiter approval flow

New behaviour so "Pending Recruiter Approvals" is meaningful:

- A `User.isApproved` boolean was added. Students/admins default to `true`;
  **recruiters register as `false`** and appear in the admin's pending queue.
- **Unapproved recruiters cannot post jobs** — `POST /api/jobs` returns 403 until
  an admin approves them. (Demo recruiters are pre-approved.)

## New API endpoints (all admin-only)

```
POST   /api/auth/demo                     { username, password, role }
GET    /api/admin/stats
GET    /api/admin/jobs
POST   /api/admin/jobs
DELETE /api/admin/jobs/:id
GET    /api/admin/recruiters/pending
PUT    /api/admin/recruiters/:id/approve
GET    /api/admin/users
DELETE /api/admin/users/:id
```

## Files changed / added

Backend
- `models/User.js` — added `admin` role + `isApproved` field *(modified)*
- `middleware/auth.js` — handle bypass tokens *(modified)*
- `controllers/authController.js` — `demoLogin` + set `isApproved` on register *(modified)*
- `controllers/jobController.js` — block unapproved recruiters *(modified)*
- `controllers/adminController.js` — stats, jobs, approvals, users *(new)*
- `routes/adminRoutes.js` — admin routes *(new)*
- `routes/authRoutes.js` — `/demo` route *(modified)*
- `server.js` — mount `/api/admin` *(modified)*

Frontend
- `context/AuthContext.jsx` — `demoLogin()` *(modified)*
- `pages/Login.jsx` — demo access panel *(modified)*
- `pages/AdminDashboard.jsx` — admin console UI *(new)*
- `App.jsx` — `/admin` route *(modified)*
- `components/Navbar.jsx` — admin link *(modified)*
- `index.css` — admin + demo styles *(modified)*

## How to run (VS Code or any terminal)

`node_modules` was stripped from this zip to keep it small, so install first.

**1. Backend**
```bash
cd job-portal/backend
npm install
npm run dev        # nodemon, or: npm start
```
The backend reads `backend/.env` (your MongoDB Atlas URI is already there) and
runs on http://localhost:5000.

**2. Frontend** (in a second terminal)
```bash
cd job-portal/frontend
npm install
npm run dev        # Vite, http://localhost:5173
```

**3. Try it**
- Open http://localhost:5173/login
- Click **Admin** under "or use demo access" → lands on `/admin`
- To test the approval flow: register a normal recruiter (Sign up → Recruiter),
  then in the admin console approve them under "Pending recruiter approvals".

> Note: the demo bypass uses a shared hardcoded credential and is intended for
> demos/development. For anything public, remove the `/api/auth/demo` route and
> the `bypass` branch in `middleware/auth.js`.
