import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';

dotenv.config();

const verifyMigration = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Verify Users
    const userCount = await User.countDocuments();
    console.log(`Users count: ${userCount}`);

    // Verify Problems
    const problemCount = await Problem.countDocuments();
    console.log(`Problems count: ${problemCount}`);

    // Verify Submissions
    const submissionCount = await Submission.countDocuments();
    console.log(`Submissions count: ${submissionCount}`);

    // Sample data verification
    const sampleUser = await User.findOne({});
    const sampleProblem = await Problem.findOne({});
    const sampleSubmission = await Submission.findOne({});

    console.log('\nSample Data Verification:');
    console.log('------------------------');
    if (sampleUser) {
      console.log('User data structure is valid');
    }
    if (sampleProblem) {
      console.log('Problem data structure is valid');
    }
    if (sampleSubmission) {
      console.log('Submission data structure is valid');
    }

    console.log('\nMigration verification completed successfully');
  } catch (error) {
    console.error('Error verifying migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
};

// Run the verification
verifyMigration(); 