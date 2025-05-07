import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function updateProblems() {
  try {
    // Read the problems file content
    const filePath = path.resolve(__dirname, '../../src/data/dsaProblems.ts');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Extract the problems array using regex
    const problemsMatch = fileContent.match(/export const problems.*?= \[([\s\S]*?)\];/);
    
    if (!problemsMatch) {
      throw new Error('Could not extract problems array from file');
    }
    
    // Convert TS notation to valid JSON
    const problemsStr = problemsMatch[0]
      .replace(/export const problems.*?= /, '')
      .replace(/\s*\/\/.*$/gm, '') // Remove comments
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
    
    // Evaluate the problems array
    const problems = eval(problemsStr);
    
    // First, delete all existing problems
    await Problem.deleteMany({});
    console.log('Deleted all existing problems');

    // Insert new problems
    await Problem.insertMany(problems);
    console.log('Successfully updated problems in the database');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error updating problems:', error);
    process.exit(1);
  }
}

updateProblems(); 