import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const initializeDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Problem.deleteMany({}),
      Submission.deleteMany({})
    ]);
    console.log('Cleared existing collections');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin'
    });
    console.log('Created admin user');

    // Create sample problems
    const sampleProblems = [
      {
        id: 'two-sum',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'easy',
        sampleTests: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]'
          }
        ],
        hiddenTests: [
          {
            input: 'nums = [3,2,4], target = 6',
            output: '[1,2]'
          }
        ],
        starterCode: 'function twoSum(nums, target) {\n  // Write your code here\n}',
        suggestedApproach: 'Use a hash map to store the complement of each number'
      }
    ];

    await Problem.insertMany(sampleProblems);
    console.log('Created sample problems');

    // Create a sample submission
    const sampleSubmission = await Submission.create({
      userId: adminUser._id,
      problemId: 'two-sum',
      code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      language: 'javascript',
      result: {
        passedTests: 2,
        totalTests: 2
      },
      submissions: [{
        code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
        language: 'javascript',
        result: {
          passedTests: 2,
          totalTests: 2
        }
      }],
      promptHistory: [
        {
          role: 'user',
          content: 'How do I solve the Two Sum problem?'
        },
        {
          role: 'assistant',
          content: 'You can use a hash map to store the complement of each number as you iterate through the array.'
        }
      ],
      promptCount: 1
    });
    console.log('Created sample submission');

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the initialization
initializeDatabase(); 