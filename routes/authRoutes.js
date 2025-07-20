import express from 'express';
import {
  signupUser,
  loginUser,
  verifyOTP,
  resendOTP,
  getUserProfile,
  updateUserProfile,
  registerAdmin
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Signup route
router.post('/signup', signupUser);

// Login route
router.post('/login', loginUser);

// OTP verification route
router.post('/verify-otp', verifyOTP);

// Resend OTP route
router.post('/resend-otp', resendOTP);

// Get user profile (protected route)
router.get('/profile', protect, getUserProfile);

// Update user profile (protected route)
router.put('/profile', protect, updateUserProfile);

// Update user (admin only)
// Bulk update names by role (admin only)

// Admin registration route
router.post('/register-admin', registerAdmin);

export default router;
