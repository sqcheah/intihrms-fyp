import express from 'express';
import { getNotificationsById } from '../controllers/notification.js';

const router = express.Router();

router.get('/:id', getNotificationsById);
export default router;
