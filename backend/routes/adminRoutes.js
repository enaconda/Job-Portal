const express = require('express');
const {
  getStats,
  getAllJobs,
  createJob,
  deleteJob,
  getPendingRecruiters,
  approveRecruiter,
  getAllUsers,
  deleteUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Every admin route requires a valid token AND the admin role.
router.use(protect, authorize('admin'));

router.get('/stats', getStats);

router.get('/jobs', getAllJobs);
router.post('/jobs', createJob);
router.delete('/jobs/:id', deleteJob);

router.get('/recruiters/pending', getPendingRecruiters);
router.put('/recruiters/:id/approve', approveRecruiter);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
