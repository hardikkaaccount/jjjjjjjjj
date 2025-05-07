import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const importData = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    const backupDir = path.join(__dirname, '../../backup');

    // Import Users
    const usersData = JSON.parse(
      await fs.readFile(path.join(backupDir, 'users.json'), 'utf-8')
    );
    await User.deleteMany({}); // Clear existing users
    await User.insertMany(usersData);
    console.log(`Imported ${usersData.length} users`);

    // Import Problems
    const problemsData = JSON.parse(
      await fs.readFile(path.join(backupDir, 'problems.json'), 'utf-8')
    );
    await Problem.deleteMany({}); // Clear existing problems
    await Problem.insertMany(problemsData);
    console.log(`Imported ${problemsData.length} problems`);

    // Import Submissions
    const submissionsData = JSON.parse(
      await fs.readFile(path.join(backupDir, 'submissions.json'), 'utf-8')
    );
    await Submission.deleteMany({}); // Clear existing submissions
    await Submission.insertMany(submissionsData);
    console.log(`Imported ${submissionsData.length} submissions`);

    console.log('\nData import completed successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
};

// Run the import
importData(); 