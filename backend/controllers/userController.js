const User = require('../models/User');

// @route GET /api/users/profile
const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

// @route PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'skills', 'education', 'company', 'companyWebsite', 'bio', 'profilePicture'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

// @route POST /api/users/resume  (student uploads/replaces resume)
const uploadResume = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can upload a resume' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resumeUrl },
      { new: true }
    ).select('-password');

    res.json({ message: 'Resume uploaded successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Resume upload failed', error: err.message });
  }
};

module.exports = { getProfile, updateProfile, uploadResume };
