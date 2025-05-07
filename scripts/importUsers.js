import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const userData = [{
  "_id": "6814f25615b0613f94a90f1c",
  "name": "Admin",
  "email": "srinidhimu05@gmail.com",
  "password": "$2b$10$7u4VVeew2scD.ED.oCPbG.iYTbbX5Gb1z7CVa.a4m6KqHtZjntt1e",
  "role": "admin",
  "tabSwitches": 0,
  "createdAt": new Date("2025-05-02T16:27:02.627Z"),
  "__v": 0
},
{
  "_id": "6817c6b42ab2f77cefb20d98",
  "name": "niranjan",
  "email": "niranjan2004niru@gmail.com",
  "password": "$2b$10$D8ia5XVmjmIBEjgiHr6bA.dQ8dJfxRn16eogurirBWK5dTjOTWgVS",
  "role": "user",
  "tabSwitches": 0,
  "submissions": [],
  "createdAt": new Date("2025-05-04T19:57:40.805Z"),
  "__v": 0,
  "lastLogin": new Date("2025-05-04T20:42:14.853Z")
},
{
  "_id": "68184ce4f5d49af3562ad9b3",
  "name": "vikas",
  "email": "vikas@gmail.com",
  "password": "$2b$10$0k4EJ8PLQomXYc8esSHop.inOQjuKy7Z/yTRC1mC8Mek/hsGI1Eza",
  "role": "user",
  "tabSwitches": 0,
  "submissions": [],
  "createdAt": new Date("2025-05-05T05:30:12.067Z"),
  "__v": 0
}];

const importUsers = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Insert new users
    const result = await User.insertMany(userData);
    console.log(`Successfully imported ${result.length} users`);

    // Verify the import
    const count = await User.countDocuments();
    console.log(`Total users in database: ${count}`);

  } catch (error) {
    console.error('Error importing users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
};

// Run the import
importUsers(); 