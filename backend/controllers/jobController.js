const Job = require('../models/Job');

// @route POST /api/jobs  (recruiter only)
const createJob = async (req, res) => {
  try {
    const { title, description, location, jobType, skillsRequired, salaryRange, experienceLevel } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: 'Title, description and location are required' });
    }

    // Recruiters must be approved by an admin before they can post jobs.
    if (req.user.isApproved === false) {
      return res.status(403).json({
        message: 'Your recruiter account is pending admin approval. You cannot post jobs yet.',
      });
    }

    const job = await Job.create({
      title,
      description,
      location,
      jobType,
      skillsRequired,
      salaryRange,
      experienceLevel,
      company: req.user.company || req.body.company || 'N/A',
      postedBy: req.user._id,
    });

    res.status(201).json({ job });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create job', error: err.message });
  }
};

// @route GET /api/jobs  (public, with search/filter/pagination)
const getJobs = async (req, res) => {
  try {
    const { search, location, jobType, experienceLevel, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };
    if (search) query.$text = { $search: search };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query.experienceLevel = experienceLevel;

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('postedBy', 'name company')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(query),
    ]);

    res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
};

// @route GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company companyWebsite');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch job', error: err.message });
  }
};

// @route PUT /api/jobs/:id  (recruiter who owns the job only)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own job postings' });
    }

    const allowedFields = ['title', 'description', 'location', 'jobType', 'skillsRequired', 'salaryRange', 'experienceLevel', 'isActive'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });

    await job.save();
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update job', error: err.message });
  }
};

// @route DELETE /api/jobs/:id  (recruiter who owns the job only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own job postings' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete job', error: err.message });
  }
};

// @route GET /api/jobs/recruiter/mine  (recruiter dashboard - jobs they posted)
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your jobs', error: err.message });
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob, getMyJobs };
