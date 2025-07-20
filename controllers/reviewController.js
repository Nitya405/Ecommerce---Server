import Review from '../models/reviewModel.js';
import Order from '../models/orderModel.js';

// POST /api/reviews
export const addReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const user = req.user.id;
    // Check if user has purchased the product
    const hasOrdered = await Order.exists({ user, 'items.product': product });
    if (!hasOrdered) {
      return res.status(403).json({ message: 'You can only review products you have purchased.' });
    }
    const review = new Review({ user, product, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/reviews/:productId
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 