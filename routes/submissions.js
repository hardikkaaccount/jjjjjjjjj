import express from 'express';
import Submission from '../models/Submission.js';
import User from '../models/User.js';
import Problem from '../models/Problem.js';
import { protect } from '../middleware/auth.js';
import { evaluateCodeBackend } from '../utils/codeEvaluator.js';

const router = express.Router();

// @route   POST /api/submissions
// @desc    Create or update a submission
// @access  Private
router.post('/', protect, async (req, res) => {
  const { problemId, code, result } = req.body;

  try {
    // Find existing submission
    let submission = await Submission.findOne({ 
      userId: req.user._id,
      problemId
    });

    if (submission) {
      // Update existing submission
      submission.questionsSubmitted += 1;
      submission.testCasesPassed = result.passedTests;
      submission.timestamp = Date.now();
      
      await submission.save();
    } else {
      // Create new submission
      submission = await Submission.create({
        userId: req.user._id,
        problemId,
        questionsSubmitted: 1,
        testCasesPassed: result.passedTests
      });
    }
    // Add submission to user's submissions array
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { submissions: submission._id } }
    );
    res.status(submission.isNew ? 201 : 200).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/submissions/:id
// @desc    Get a submission by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Check if user owns this submission or is admin
    if (submission.userId.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/submissions/:problemId/prompt
// @desc    Increment prompt count for a problem
// @access  Private
router.put('/:problemId/prompt', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.incrementPromptCount(req.params.problemId);
    
    res.json({ 
      promptCount: user.getPromptCount(req.params.problemId)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/submissions/submit
// @desc    Securely evaluate code against hidden tests
// @access  Private
router.post('/submit', protect, async (req, res) => {
  const { problemId, code, language } = req.body;
  try {
    // Fetch the problem with hidden tests
    const problem = await Problem.findOne({ id: problemId });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    const hiddenTests = problem.hiddenTests || [];
    // Evaluate code (assume evaluateCodeBackend returns { passedTests, totalTests, results })
    const functionName = problem.starterCode.match(/function\s+(\w+)/)?.[1] || 'solution';
    const testResults = await evaluateCodeBackend(code, functionName, hiddenTests, language);
    // Save or update submission
    let submission = await Submission.findOne({ userId: req.user._id, problemId });
    if (submission) {
      submission.questionsSubmitted += 1;
      submission.testCasesPassed = testResults.passedTests;
      submission.timestamp = Date.now();
      await submission.save();
    } else {
      submission = await Submission.create({
        userId: req.user._id,
        problemId,
        questionsSubmitted: 1,
        testCasesPassed: testResults.passedTests
      });
    }
    // Add submission to user's submissions array
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { submissions: submission._id } }
    );
    res.json({
      passedTests: testResults.passedTests,
      totalTests: testResults.totalTests,
      results: testResults.results,
      submission
    });
  } catch (error) {
    console.error('Error evaluating submission:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router; 