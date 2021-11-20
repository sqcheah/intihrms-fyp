import express from 'express';
import { getNotifications } from '../controllers/notification.js';

const router = express.Router();

router.get('/', getNotifications);
export default router;
