import express from 'express';
import Problem from '../models/Problem.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/problems
// @desc    Get all problems
// @access  Public
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find({}).select('-hiddenTests');
    res.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/problems/:id
// @desc    Get a problem by ID (including hiddenTests)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findOne({ id: req.params.id });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/problems
// @desc    Create a new problem
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json(problem);
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/problems/:id
// @desc    Update a problem
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const problem = await Problem.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (problem) {
      res.json(problem);
    } else {
      res.status(404).json({ message: 'Problem not found' });
    }
  } catch (error) {
    console.error('Error updating problem:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/problems/:id
// @desc    Delete a problem
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const problem = await Problem.findOneAndDelete({ id: req.params.id });

    if (problem) {
      res.json({ message: 'Problem removed' });
    } else {
      res.status(404).json({ message: 'Problem not found' });
    }
  } catch (error) {
    console.error('Error deleting problem:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router; 