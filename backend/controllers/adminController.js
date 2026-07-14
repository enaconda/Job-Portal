const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @route GET /api/admin/stats
// Returns the headline numbers shown on the admin dashboard.
const getStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalRecruiters,
      totalJobs,
      activeJobs,
      totalApplications,
      pendingRecruiterApprovals,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'recruiter' }),
      Job.countDocuments({}),
      Job.countDocuments({ isActive: true }),
      Application.countDocuments({}),
      User.countDocuments({ role: 'recruiter', isApproved: false }),
    ]);

    res.json({
      stats: {
        totalStudents,
        totalRecruiters,
        totalJobs,
        activeJobs,
        totalApplications,
        pendingRecruiterApprovals,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load stats', error: err.message });
  }
};

// @route GET /api/admin/jobs
// Every job in the system (not just active ones), newest first.
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({})
      .populate('postedBy', 'name company email')
      .sort({ createdAt: -1 });

    // Attach an applicant count to each job for context.
    const withCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await Application.countDocuments({ job: job._id });
        return { ...job.toObject(), applicants };
      })
    );

    res.json({ jobs: withCounts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
};

// @route POST /api/admin/jobs
// Admin can create a job directly (bypasses the recruiter-ownership rules).
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      jobType,
      skillsRequired,
      salaryRange,
      experienceLevel,
    } = req.body;

    if (!title || !description || !location || !company) {
      return res
        .status(400)
        .json({ message: 'Title, description, company and location are required' });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      jobType,
      skillsRequired: Array.isArray(skillsRequired)
        ? skillsRequired
        : (skillsRequired || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
      salaryRange,
      experienceLevel,
      postedBy: req.user._id, // synthetic admin id — valid ObjectId
    });

    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create job', error: err.message });
  }
};

// @route DELETE /api/admin/jobs/:id
// Admin can remove ANY job regardless of who posted it.
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Clean up applications tied to the job so nothing dangles.
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();

    res.json({ message: 'Job and its applications deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete job', error: err.message });
  }
};

// @route GET /api/admin/recruiters/pending
// Recruiters awaiting approval.
const getPendingRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({ role: 'recruiter', isApproved: false })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ recruiters });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending recruiters', error: err.message });
  }
};

// @route PUT /api/admin/recruiters/:id/approve
const approveRecruiter = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'recruiter') {
      return res.status(400).json({ message: 'That account is not a recruiter' });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: 'Recruiter approved', user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve recruiter', error: err.message });
  }
};

// @route GET /api/admin/users
// Full user directory (students + recruiters), newest first.
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['student', 'recruiter'] } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// @route DELETE /api/admin/users/:id
// Remove a user and clean up their jobs/applications.
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'recruiter') {
      const jobs = await Job.find({ postedBy: user._id });
      const jobIds = jobs.map((j) => j._id);
      await Application.deleteMany({ job: { $in: jobIds } });
      await Job.deleteMany({ postedBy: user._id });
    } else if (user.role === 'student') {
      await Application.deleteMany({ applicant: user._id });
    }

    await user.deleteOne();
    res.json({ message: 'User and related data removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

module.exports = {
  getStats,
  getAllJobs,
  createJob,
  deleteJob,
  getPendingRecruiters,
  approveRecruiter,
  getAllUsers,
  deleteUser,
};
