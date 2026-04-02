import { Router } from 'express';
import { getUserController } from '../controllers/userController';

const router = Router();

router.get('/:id', getUserController);

export default router;