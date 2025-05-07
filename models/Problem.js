import mongoose from 'mongoose';

const TestCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  }
});

const ProblemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
    index: true
  },
  sampleTests: {
    type: [TestCaseSchema],
    default: [],
    required: true,
    validate: {
      validator: function(tests) {
        return tests.length > 0;
      },
      message: 'At least one sample test is required'
    }
  },
  hiddenTests: {
    type: [TestCaseSchema],
    default: [],
    required: true,
    validate: {
      validator: function(tests) {
        return tests.length > 0;
      },
      message: 'At least one hidden test is required'
    }
  },
  starterCode: {
    type: String,
    required: true,
    trim: true
  },
  suggestedApproach: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for common queries
ProblemSchema.index({ title: 'text', description: 'text' });

// Pre-save middleware to ensure id is unique
ProblemSchema.pre('save', async function(next) {
  if (this.isModified('id')) {
    const existingProblem = await this.constructor.findOne({ id: this.id });
    if (existingProblem && existingProblem._id.toString() !== this._id.toString()) {
      next(new Error('Problem ID must be unique'));
    }
  }
  next();
});

const Problem = mongoose.model('Problem', ProblemSchema);

export default Problem; 