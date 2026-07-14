const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      default: 'Full-time',
    },
    skillsRequired: [{ type: String }],
    salaryRange: { type: String, default: 'Not disclosed' },
    experienceLevel: {
      type: String,
      enum: ['Entry', 'Mid', 'Senior'],
      default: 'Entry',
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', description: 'text', skillsRequired: 'text' });

module.exports = mongoose.model('Job', jobSchema);
