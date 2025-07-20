import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (err) {
    console.error('Get Orders Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Validate products exist
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.name} not found` });
      }
    }

    const order = new Order({
      user: req.user.id,
      items,
      total,
      shippingAddress,
      paymentMethod
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Create Order Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name price image description');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error('Get Order Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Update Order Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete order (admin only)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Delete Order Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name price image');
    res.status(200).json(orders);
  } catch (err) {
    console.error('Get All Orders Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}; 

// Admin: Get daily transactions
export const getDailyTransactions = async (req, res) => {
  try {
    const { date } = req.query; // format: YYYY-MM-DD
    if (!date) return res.status(400).json({ message: 'Date is required' });
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    const orders = await Order.find({
      createdAt: { $gte: start, $lt: end }
    })
      .populate('user', 'name email')
      .populate('items.product', 'name price');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get monthly transactions
export const getMonthlyTransactions = async (req, res) => {
  try {
    const { year, month } = req.query; // month: 1-12
    if (!year || !month) return res.status(400).json({ message: 'Year and month are required' });
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const orders = await Order.find({
      createdAt: { $gte: start, $lt: end }
    })
      .populate('user', 'name email')
      .populate('items.product', 'name price');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get date-range transactions
export const getDateRangeTransactions = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) return res.status(400).json({ message: 'Start and end date are required' });
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    const orders = await Order.find({
      createdAt: { $gte: start, $lt: end }
    })
      .populate('user', 'name email')
      .populate('items.product', 'name price');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get user-based purchased details
export const getUserPurchases = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Valid userId is required' });
    }
    const orders = await Order.find({ user: userId })
      .populate('user', 'name email')
      .populate('items.product', 'name price');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 