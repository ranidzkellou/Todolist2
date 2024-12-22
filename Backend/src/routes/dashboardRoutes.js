import { Router } from 'express';
const router = Router();
import { getTodayData, getMonthData, getStats } from '../controllers/dashboardController.js';

router.get('/today', getTodayData);
router.get('/month', getMonthData);
router.get('/', getStats);

export default router;
