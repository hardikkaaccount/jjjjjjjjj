import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: String,
    required: true,
  },
  questionsSubmitted: {
    type: Number,
    default: 0,
  },
  testCasesPassed: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for uniqueness
SubmissionSchema.index({ userId: 1, problemId: 1 }, { unique: true });

// Method to increment test cases passed
SubmissionSchema.methods.incrementTestCasesPassed = async function(count = 1) {
  this.testCasesPassed += count;
  return this.save();
};

// Method to increment questions submitted
SubmissionSchema.methods.incrementQuestionsSubmitted = async function(count = 1) {
  this.questionsSubmitted += count;
  return this.save();
};

const Submission = mongoose.model('Submission', SubmissionSchema);

export default Submission; 