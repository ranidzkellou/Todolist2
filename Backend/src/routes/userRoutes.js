import { Router } from 'express';
const router = Router();
import userController from '../controllers/userController.js';


router.put('/update-password', userController.updatePassword);
router.delete('/delete-account', userController.deleteAccount);
router.put('/update-info', userController.updateUserInfo);
router.get('/', userController.getUserInfo);       

export default router;
