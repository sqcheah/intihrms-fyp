import express from 'express';
import auth from '../middleware/auth.js';
import {
  createPolicy,
  getPolicy,
  getPolicies,
  updatePolicy,
} from '../controllers/policy.js';
const router = express.Router();

router.post('/', auth, createPolicy);
router.get('/', auth, getPolicies);
router.get('/:id', auth, getPolicy);
router.patch('/:id', auth, updatePolicy);

export default router;
