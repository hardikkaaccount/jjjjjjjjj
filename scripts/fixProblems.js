import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';

dotenv.config();

async function fixProblems() {
  await mongoose.connect(process.env.MONGO_URI);
  const problems = await Problem.find({});
  let updatedCount = 0;

  for (const problem of problems) {
    let needsUpdate = false;
    if (!Array.isArray(problem.sampleTests)) {
      problem.sampleTests = [];
      needsUpdate = true;
    }
    if (!Array.isArray(problem.hiddenTests)) {
      problem.hiddenTests = [];
      needsUpdate = true;
    }
    if (needsUpdate) {
      await problem.save();
      updatedCount++;
    }
  }

  console.log(`Updated ${updatedCount} problems.`);
  mongoose.disconnect();
}

fixProblems().catch(err => {
  console.error(err);
  mongoose.disconnect();
}); 