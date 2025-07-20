import Feedback from '../models/feedbackModel.js';

// POST /api/feedback
export const addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const user = req.user ? req.user.id : undefined;
    const feedback = new Feedback({ user, rating, comment });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/feedback (admin only)
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('user', 'name email');
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}; 