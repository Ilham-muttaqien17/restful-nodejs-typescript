import express from 'express';
import authMiddleware from '@src/middlewares/auth';
import user from '@src/controllers/user.controller';
import auth from '@src/controllers/auth.controller';
import { uploader } from '@src/utils/multipart';

const router = express.Router();

router.use(authMiddleware);

// User
router.get('/users', user.list);
router.get('/users/:id', user.detail);
router.patch('/users/:id', user.update);
router.delete('/users/:id', user.destroy);

// Auth
router.get('/current-user', auth.current);
router.patch('/current-user', uploader.any(), auth.update);
router.delete('/logout', auth.logout);

export default router;
