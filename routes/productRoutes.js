// server/routes/productRoutes.js
import express from 'express';
import {
  getProducts,
  seedProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  restoreProduct
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/products/seed
 * @desc    Seed sample products (run once to populate database)
 */
router.post('/seed', seedProducts);

/**
 * @route   GET /api/products
 * @desc    Fetch all products
 */
router.get('/', getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Fetch a single product by id
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/products
 * @desc    Add a new product
 */
router.post('/', protect, async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}, addProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 */
router.put('/:id', protect, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 */
router.delete('/:id', protect, deleteProduct);

/**
 * @route   PUT /api/products/:id/restore
 * @desc    Restore a soft-deleted product
 */
router.put('/:id/restore', protect, restoreProduct);

export default router;
