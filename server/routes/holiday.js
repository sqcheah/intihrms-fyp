import express from 'express';
import {
  createHoliday,
  fetchAllHolidays,
  fetchHolidaysByYear,
  updateHoliday,
} from '../controllers/holiday.js';

const router = express.Router();

router.get('/', fetchAllHolidays);
router.get('/:year', fetchHolidaysByYear);
router.post('/', createHoliday);
router.post('/:id', updateHoliday);

export default router;
