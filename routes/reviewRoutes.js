import express from 'express';
import { addReview, getProductReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add a review (user must be logged in)
router.post('/', protect, addReview);
// Get all reviews for a product
router.get('/:productId', getProductReviews);

export default router; 