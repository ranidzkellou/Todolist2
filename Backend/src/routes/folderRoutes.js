import { Router } from 'express';
import { getAllFolders, createFolder, getFolderById, updateFolder, deleteFolder } from '../controllers/folderController.js';

const router = Router();

router.get('/', getAllFolders);
router.post('/create', createFolder);
router.get('/:id', getFolderById);
router.put('/:id', updateFolder);
router.delete('/:id', deleteFolder);

export default router;
