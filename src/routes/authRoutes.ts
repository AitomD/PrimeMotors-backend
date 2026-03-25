import { Router } from 'express';
import { register } from '../controllers/authControllers';

const router = Router();

router.post('/users',register)

export default router;









