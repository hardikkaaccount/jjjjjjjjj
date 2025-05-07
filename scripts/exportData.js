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

const exportData = async () => {
  try {
    // Connect to local MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to local MongoDB');

    // Create backup directory if it doesn't exist
    const backupDir = path.join(__dirname, '../../backup');
    await fs.mkdir(backupDir, { recursive: true });

    // Export Users
    const users = await User.find({}).lean();
    await fs.writeFile(
      path.join(backupDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    console.log(`Exported ${users.length} users`);

    // Export Problems
    const problems = await Problem.find({}).lean();
    await fs.writeFile(
      path.join(backupDir, 'problems.json'),
      JSON.stringify(problems, null, 2)
    );
    console.log(`Exported ${problems.length} problems`);

    // Export Submissions
    const submissions = await Submission.find({}).lean();
    await fs.writeFile(
      path.join(backupDir, 'submissions.json'),
      JSON.stringify(submissions, null, 2)
    );
    console.log(`Exported ${submissions.length} submissions`);

    console.log('\nData export completed successfully');
    console.log('Files saved in:', backupDir);
  } catch (error) {
    console.error('Error exporting data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from local MongoDB');
  }
};

// Run the export
exportData(); 