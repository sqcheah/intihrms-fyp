import express from 'express';
import leavesRoutes from './leaves.js';
import userRoutes from './users.js';
import deptRoutes from './department.js';
import leaveTypesRoutes from './leaveType.js';
import rolesRoutes from './roles.js';
import holidayRoutes from './holiday.js';
import trainingRoutes from './training.js';
import trainingRequestRoutes from './training.js';
import policyRoutes from './policy.js';
const router = express.Router();

router.use('/leaves', leavesRoutes);
router.use('/users', userRoutes);
router.use('/depts', deptRoutes);
router.use('/leaveTypes', leaveTypesRoutes);
router.use('/roles', rolesRoutes);
router.use('/holidays', holidayRoutes);
router.use('/training', trainingRoutes);
router.use('/trainingRequest', trainingRequestRoutes);
router.use('/policy', policyRoutes);

export default router;
