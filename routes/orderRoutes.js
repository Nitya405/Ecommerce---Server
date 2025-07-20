import express from 'express';
import {
  getUserOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  deleteOrder,
  getDailyTransactions,
  getMonthlyTransactions,
  getDateRangeTransactions,
  getUserPurchases
} from '../controllers/orderController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get user's orders
router.get('/user', getUserOrders);

// Create new order
router.post('/', createOrder);

// Get specific order
router.get('/:id', getOrderById);

// Get all orders (admin only)
router.get('/', getAllOrders);

// Update order status (admin only)
router.put('/:id', updateOrderStatus);

// Delete order (admin only)
router.delete('/:id', deleteOrder);

// Admin-only report routes
router.get('/report/daily', isAdmin, getDailyTransactions);
router.get('/report/monthly', isAdmin, getMonthlyTransactions);
router.get('/report/daterange', isAdmin, getDateRangeTransactions);
router.get('/report/user', isAdmin, getUserPurchases);

export default router; 