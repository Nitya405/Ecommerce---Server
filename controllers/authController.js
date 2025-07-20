import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from '../utils/emailService.js';

// ========== SIGNUP FUNCTION ==========
export const signupUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    if (!firstName || !lastName || !phone || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    console.log('Generated OTP:', otp);
    console.log('OTP expires at:', otpExpires);

    const name = `${firstName} ${lastName}`.trim();
    const newUser = new User({
      name,
      phone,
      email,
      password, // Password will be hashed by the pre-save middleware
      isVerified: false,
      otp,
      otpExpires
    });

    console.log('User object before save:', {
      firstName: newUser.firstName,
      email: newUser.email,
      otp: newUser.otp,
      otpExpires: newUser.otpExpires,
      isVerified: newUser.isVerified
    });

    await newUser.save();
    
    console.log('User saved successfully. User ID:', newUser._id);
    console.log('User after save:', {
      id: newUser._id,
      otp: newUser.otp,
      otpExpires: newUser.otpExpires,
      isVerified: newUser.isVerified
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, firstName);
    
    if (emailSent) {
      res.status(201).json({ 
        message: 'User registered successfully. Please check your email for verification code.',
        userId: newUser._id,
        otp // <-- For demo/testing only. Remove in production!
      });
    } else {
      res.status(201).json({ 
        message: 'User registered successfully. Please contact support for email verification.',
        userId: newUser._id,
        otp // <-- For demo/testing only. Remove in production!
      });
    }
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== LOGIN FUNCTION ==========
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Restrict admin login to only the specified credentials
  if (email.endsWith('@kongu.edu')) {
    if (email !== 'nityasreevd.23bir@kongu.edu' || password !== 'Nitya@0405') {
      return res.status(401).json({ message: 'Admin login restricted to specific credentials' });
    }
  }

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(401).json({ 
        message: "Please verify your email before logging in",
        userId: user._id,
        needsVerification: true
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '2h' });

    res.status(200).json({ token, role: user.role });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ========== VERIFY OTP ==========
export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: 'User ID and OTP are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found for OTP verification:', {
      id: user._id,
      email: user.email,
      storedOTP: user.otp,
      providedOTP: otp,
      isVerified: user.isVerified,
      otpExpires: user.otpExpires
    });

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (user.otp !== otp) {
      console.log('OTP mismatch:', { stored: user.otp, provided: otp });
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.firstName);

    res.status(200).json({ 
      message: 'Email verified successfully! Welcome to GlowIt Organics!' 
    });
  } catch (err) {
    console.error('OTP Verification Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== RESEND OTP ==========
export const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send new OTP email
    const emailSent = await sendOTPEmail(user.email, otp, user.firstName);
    
    if (emailSent) {
      res.status(200).json({ 
        message: 'New verification code sent to your email',
        otp // <-- For demo/testing only. Remove in production!
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to send verification code. Please try again.' 
      });
    }
  } catch (err) {
    console.error('Resend OTP Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== ADMIN REGISTRATION ========== 
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'user';
    const newAdmin = new User({ name, email, password: hashedPassword, phone, role: userRole, isVerified: true });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully', userId: newAdmin._id });
  } catch (err) {
    console.error('Admin Registration Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== GET USER PROFILE ==========
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Profile Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ========== UPDATE USER PROFILE ==========
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { firstName, lastName, email, phone } = req.body;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    await user.save();
    const updatedUser = await User.findById(user._id).select('-password');
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};