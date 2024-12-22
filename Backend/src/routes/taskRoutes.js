import { Router } from 'express';
import taskController from '../controllers/taskController.js';

const router = Router();

router.post('/create', taskController.createTask);
router.put('/update/:taskId', taskController.updateTask);
router.delete('/delete/:taskId', taskController.deleteTask);
router.put('/complete/:taskId', taskController.checkTaskStatus);
router.put('/:taskId', taskController.updateTask);
router.get('/notifications', taskController.getNotifications);
router.get('/categories', taskController.getTasksByCategories);

export default router;
