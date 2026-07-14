const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Hired'],
      default: 'Applied',
    },
  },
  { timestamps: true }
);

// Prevent a student from applying twice to the same job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
