const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['student', 'recruiter', 'admin'], required: true },

    // Recruiters must be approved by an admin before they can post jobs.
    // Students and admins are approved automatically.
    isApproved: { type: Boolean, default: true },

    // Student-specific fields
    resumeUrl: { type: String, default: null },
    skills: [{ type: String }],
    education: { type: String, default: '' },

    // Recruiter-specific fields
    company: { type: String, default: '' },
    companyWebsite: { type: String, default: '' },

    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
