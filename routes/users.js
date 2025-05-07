import express from 'express';
import User from '../models/User.js';
import Submission from '../models/Submission.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    // Ensure user can only view their own data (or admin)
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to view this user\'s data' });
    }

    const user = await User.findById(req.params.id)
      .select('-password')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // The toJSON method will handle the conversion of prompts_used
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/:id/tab-switch
// @desc    Increment tab switch count
// @access  Private
router.put('/:id/tab-switch', protect, async (req, res) => {
  try {
    // Ensure user can only update their own data
    if (req.user._id.toString() !== req.params.id) {
      return res.status(401).json({ message: 'Not authorized to update this user\'s data' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.tabSwitches += 1;
    await user.save();

    res.json({ tabSwitches: user.tabSwitches });
  } catch (error) {
    console.error('Error updating tab switch count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/:id/submissions
// @desc    Get user submissions
// @access  Private
router.get('/:id/submissions', protect, async (req, res) => {
  try {
    // Ensure user can only view their own submissions (or admin)
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to view these submissions' });
    }

    const submissions = await Submission.find({ userId: req.params.id });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router; 