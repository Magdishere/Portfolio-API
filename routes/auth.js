import express from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

export default router;
