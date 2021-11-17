import express from 'express';
import {
  signIn,
  signUp,
  createUser,
  getUser,
  getUsers,
  updateUser,
  resetPassword,
  fetchDeptUsers,
} from '../controllers/users.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.post('/signIn', signIn);
router.post('/signUp', signUp);
router.post('/', createUser);
router.post('/resetPassword', resetPassword);

router.get('/', auth, getUsers);
router.get('/:id', auth, getUser);
router.patch('/:id', auth, updateUser);
router.get('/dept/:department', auth, fetchDeptUsers);

export default router;
