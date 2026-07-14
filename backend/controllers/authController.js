const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide name, email, password and role' });
    }

    if (!['student', 'recruiter'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either student or recruiter' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      company: role === 'recruiter' ? company : undefined,
      // Recruiters start unapproved and appear in the admin's pending queue.
      isApproved: role === 'recruiter' ? false : true,
    });

    const token = generateToken(user._id);
    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// ---------------------------------------------------------------------------
// Demo / bypass login
// ---------------------------------------------------------------------------
// Lets you sign in as admin, student, or recruiter using a single shared
// credential (enaconda / enaconda) WITHOUT creating a real database account
// and WITHOUT any OTP/email-verification step. The issued JWT carries a
// `bypass` flag; the auth middleware builds a synthetic user from it instead
// of looking the account up in MongoDB.
//
// These synthetic users have stable, valid ObjectId strings so that any
// documents they create (e.g. an admin-posted job's `postedBy`) remain
// well-formed. This is intended for demos/development only.

const DEMO_USERNAME = 'enaconda';
const DEMO_PASSWORD = 'enaconda';

// Fixed 24-char hex ObjectIds, one per synthetic role.
const DEMO_IDS = {
  admin: '000000000000000000000a11',
  student: '000000000000000000000b22',
  recruiter: '000000000000000000000c33',
};

const buildDemoUser = (role) => ({
  _id: DEMO_IDS[role],
  name: `Demo ${role.charAt(0).toUpperCase()}${role.slice(1)}`,
  email: `${role}@enaconda.demo`,
  role,
  isApproved: true,
  company: role === 'recruiter' ? 'Enaconda Demo Co.' : '',
  bypass: true,
});

// @route POST /api/auth/demo
// body: { username, password, role }  role ∈ admin | student | recruiter
const demoLogin = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (username !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
      return res.status(401).json({ message: 'Invalid demo credentials' });
    }
    if (!['admin', 'student', 'recruiter'].includes(role)) {
      return res.status(400).json({ message: 'Role must be admin, student or recruiter' });
    }

    // Sign a token that encodes the role and the bypass flag.
    const token = jwt.sign(
      { id: DEMO_IDS[role], role, bypass: true },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ token, user: buildDemoUser(role) });
  } catch (err) {
    res.status(500).json({ message: 'Demo login failed', error: err.message });
  }
};

module.exports = { register, login, getMe, demoLogin };
