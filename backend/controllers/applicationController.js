const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @route POST /api/applications/:jobId  (student applies to a job)
const applyToJob = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can apply to jobs' });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const user = await User.findById(req.user._id);
    if (!user.resumeUrl) {
      return res.status(400).json({ message: 'Please upload a resume before applying' });
    }

    const application = await Application.create({
      job: job._id,
      applicant: req.user._id,
      resumeUrl: user.resumeUrl,
      coverLetter: req.body.coverLetter || '',
    });

    res.status(201).json({ application });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You have already applied to this job' });
    }
    res.status(500).json({ message: 'Failed to submit application', error: err.message });
  }
};

// @route GET /api/applications/mine  (student tracks their applications)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        select: 'title company location jobType',
      })
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
  }
};

// @route GET /api/applications/job/:jobId  (recruiter views applicants for their job)
const getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only view applicants for your own job postings' });
    }

    const applications = await Application.find({ job: job._id })
      .populate('applicant', 'name email skills education resumeUrl')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applicants', error: err.message });
  }
};

// @route PUT /api/applications/:id/status  (recruiter updates applicant status)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only manage applicants for your own job postings' });
    }

    application.status = status;
    await application.save();

    res.json({ application });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update application status', error: err.message });
  }
};

module.exports = { applyToJob, getMyApplications, getApplicantsForJob, updateApplicationStatus };
