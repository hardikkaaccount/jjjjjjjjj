import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  tabSwitches: {
    type: Number,
    default: 0,
  },
  prompts_used: {
    type: Map,
    of: Number,
    default: () => new Map(),
  },
  submissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  }],
  lastLogin: { 
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare passwords method
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Method to increment prompt count for a specific question
UserSchema.methods.incrementPromptCount = async function(problemId) {
  if (!this.prompts_used) {
    this.prompts_used = new Map();
  }
  const currentCount = this.prompts_used.get(problemId) || 0;
  this.prompts_used.set(problemId, currentCount + 1);
  return this.save();
};

// Method to get prompt count for a specific question
UserSchema.methods.getPromptCount = function(problemId) {
  if (!this.prompts_used) {
    return 0;
  }
  return this.prompts_used.get(problemId) || 0;
};

// Method to get total prompts used across all problems
UserSchema.methods.getTotalPromptsUsed = function() {
  if (!this.prompts_used) {
    return 0;
  }
  return Array.from(this.prompts_used.values()).reduce((sum, count) => sum + count, 0);
};

// Method to add a submission
UserSchema.methods.addSubmission = async function(submissionId) {
  if (!this.submissions.includes(submissionId)) {
    this.submissions.push(submissionId);
    return this.save();
  }
  return this;
};

// Method to convert prompts_used to a plain object
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  if (obj.prompts_used) {
    obj.prompts_used = Object.fromEntries(obj.prompts_used);
  }
  return obj;
};

const User = mongoose.model('User', UserSchema);

export default User; 