import express from 'express';
import {
  fetchAllLeaves,
  createLeave,
  updateLeave,
  fetchLeaveById,
  sendMail,
  fetchLeaveByDateRange,
  fetchLeaveRequests,
  fetchUpcomingLeaves,
  fetchLeaveHistory,
  fetchTodayLeaves,
  fetchLeaveCount,
} from '../controllers/leaves.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/filehelper.js';
const router = express.Router();

router.get('/', auth, fetchAllLeaves);
router.get('/:id', auth, fetchLeaveById);
router.post('/', [auth, upload.array('files')], createLeave);
router.patch('/:id', auth, updateLeave);
router.post('/range', auth, fetchLeaveByDateRange);
router.get('/:role/:user/:department', auth, fetchLeaveRequests);
router.get('/upcoming/:id', auth, fetchUpcomingLeaves);
router.get('/history/:id', auth, fetchLeaveHistory);
router.get('/date/today', auth, fetchTodayLeaves);
router.get('/count/dept', auth, fetchLeaveCount);

export default router;
