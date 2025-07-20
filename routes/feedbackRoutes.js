import express from 'express';
import { addFeedback, getAllFeedback } from '../controllers/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add feedback (user must be logged in)
router.post('/', protect, addFeedback);
// Get all feedback (admin only)
router.get('/', protect, getAllFeedback);

export default router; 