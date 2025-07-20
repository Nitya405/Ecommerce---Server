// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);            // Auth routes: /api/auth/signup, /api/auth/login
app.use('/api/products', productRoutes);     // Product routes: /api/products, /api/products/seed
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);         // Order routes: /api/orders/user, /api/orders
app.use('/api/reviews', reviewRoutes); // Review routes: /api/reviews
app.use('/api/feedback', feedbackRoutes); // Feedback routes: /api/feedback

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
mongoose.connect(mongoURI)
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.log('Please make sure MongoDB is running or set MONGO_URI in .env file');
});
