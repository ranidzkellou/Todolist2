import { Router } from 'express';
import subtaskController from '../controllers/subtaskController.js';

const router = Router();

router.post('/create', subtaskController.createSubtask);
router.put('/update/:id', subtaskController.updateSubtask);
router.put('/complete/:subtaskId', subtaskController.checkSubTaskStatus);
router.delete('/:id', subtaskController.deleteSubtask);

export default router;
