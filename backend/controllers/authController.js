const Admin = require('../models/Admin');
const { generateToken } = require('../utils/generateToken');

/**
 * @desc    Register a new admin
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'Admin with this email already exists.',
      });
    }

    // Create new admin
    const admin = await Admin.create({
      email: email.toLowerCase().trim(),
      password,
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully.',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login admin
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // Find admin and include password field
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare passwords
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current admin profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      admin: {
        id: req.admin._id,
        email: req.admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Seed initial admin (for first-time setup)
 * @route   POST /api/auth/seed
 * @access  Public (should be disabled in production)
 */
const seedAdmin = async (req, res, next) => {
  try {
    const existing = await Admin.findOne({ email: 'admin@example.com' });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Admin already exists.' });
    }

    const admin = await Admin.create({
      email: 'admin@example.com',
      password: 'admin123',
    });

    res.status(201).json({
      success: true,
      message: 'Default admin created. Email: admin@example.com | Password: admin123',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerAdmin, loginAdmin, getMe, seedAdmin };
