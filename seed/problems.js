import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Problem from '../models/Problem.js';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

// Connect to MongoDB
connectDB();

// Read problems from the TS file directly
const importProblems = async () => {
  try {
    // First clear existing problems
    await Problem.deleteMany();
    
    console.log('Importing problems...');
    
    // Read the problems file content
    const filePath = path.resolve(process.cwd(), 'src/data/dsaProblems.ts');
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
    
    // Insert the problems
    await Problem.insertMany(problems);
    
    console.log('Problems imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importProblems(); 