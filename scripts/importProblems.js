import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';

dotenv.config();

const problemData = [{
  "_id": "6817d1ee820ebc167efc2fdd",
  "id": "1",
  "title": "Civil War - Optimal Team Selection",
  "description": "In this superhero epic, the denizens of the Marvel Universe are forced to pick sides when Captain America and Iron Man come to blows over ideological differences.\nThe government decides to push for the Hero Registration Act, a law that limits a hero's actions. This results in a division in The Avengers. Iron Man stands with this Act, claiming that their actions must be kept in check otherwise cities will continue to be destroyed, but Captain America feels that saving the world is daring enough and that they cannot rely on the government to protect the world. And here the civil war begins.\n\nThey are trying make their team stronger by adding more avengers to their team. There are N avengers lined up.\n\nRules to add avenger to their team-\n\nAny team can start first. But they will alternatively only.\nThey can select avenger from any side. But if they start from one side they can't move to other side in current chance.\nThey can select consecutive avengers as many they want.\nThey will stop only when all the avengers are part of either side.\nEvery Avenger has a power associated with him\nThere are some spurious avengers who will decrease the overall power of the team.\nBoth teams will select players optimally. Find the difference of powers of the two teams\n\nConstraints\n1<= N <= 10^6\n-10^9 <= p[i] <= 10^9\n\nInput\nFirst line contains an integer denoting the number of Avengers(N).\nNext lines contain N space separated values denoting power of every avenger(P[i]).\n\nOutput\nPrint the difference of the powers of teams",
  "difficulty": "hard",
  "sampleTests": [
    {
      "input": "[4, [5, -3, 7, -1]]",
      "output": "0",
      "_id": "6817d1ee820ebc167efc2fde"
    },
    {
      "input": "[6, [1, 2, 3, 4, 5, 6]]",
      "output": "1",
      "_id": "6817d1ee820ebc167efc2fdf"
    }
  ],
  "hiddenTests": [
    {
      "input": "[5, [-1, -2, -3, -4, -5]]",
      "output": "1",
      "_id": "6817d1ee820ebc167efc2fe0"
    },
    {
      "input": "[3, [1000000000, -1000000000, 999999999]]",
      "output": "1",
      "_id": "6817d1ee820ebc167efc2fe1"
    },
    {
      "input": "[5, [-10, 30, -20, 40, -50]]",
      "output": "10",
      "_id": "6817d1ee820ebc167efc2fe2"
    },
    {
      "input": "[1, [7]]",
      "output": "7",
      "_id": "6817d1ee820ebc167efc2fe3"
    },
    {
      "input": "[6, [5, 5, 5, -5, -5, -5]]",
      "output": "0",
      "_id": "6817d1ee820ebc167efc2fe4"
    },
    {
      "input": "[5, [100, -100, 200, -200, 300]]",
      "output": "100",
      "_id": "6817d1ee820ebc167efc2fe5"
    },
    {
      "input": "[1, [-9]]",
      "output": "9",
      "_id": "6817d1ee820ebc167efc2fe6"
    }
  ],
  "starterCode": "function civilWar(n, powers) {\n}",
  "suggestedApproach": "This is a dynamic programming problem where you need to consider optimal choices for both teams. The key is to calculate the maximum difference in power that can be achieved when it's a player's turn to pick avengers.",
  "__v": 0
},
{
  "_id": "6817d1ee820ebc167efc2fe7",
  "id": "seating-arrangement",
  "title": "Seating Arrangement",
  "description": "You are a caretaker of a waiting room and you have to take care of empty seats such that all the people should sit together. Imagine the seats are in a straight line like in a movie theatre. People are seated on random seats initially. Your task is to make them sit together so that minimum number of people change their position. Also, they can be made to sit together in many ways. Find the number of ways you can make them sit together by requiring only minimal people movement.\n\n\"E\" depicts an empty seat and \"O\" depicts an occupied seat. Input will be given in the form of a string.\n\nExample: OEOEO\nAs we can see, only seat number 1, 3, 5 are occupied and 2 and 4 are empty.\nCase 1: If we move 5th person to 2nd position, they can all be together with only one person moving his/her place.\nCase 2: If we movement 1st person to 4th position, they can all be together with only one person moving his/her place.\n\nThey can all be together with only one movement and this can be done in 2 ways. Print the minimum number of movements required and the number of ways this minimum movement can help achieve the objective.\n\nNote: If they are already sitting together, Print \"00\" as output.\n\nConstraints:\n0 < N <= 100000\n\nInput:\nFirst line contains an integer N which depicts the number of seats\nSecond line contains N characters each of which are either \"O\" or \"E\". \"O\" denotes an occupied seat and \"E\" denotes an empty seat.\n\nOutput:\nPrint minimum number of movements required and the number of ways in which all people can be made to sit together without exceeding minimum number of movements by space",
  "difficulty": "medium",
  "sampleTests": [
    {
      "input": "[5, \"OEOEO\"]",
      "output": "1 2",
      "_id": "6817d1ee820ebc167efc2fe8"
    }
  ],
  "hiddenTests": [
    {
      "input": "[1, \"E\"]",
      "output": "0 0",
      "_id": "6817d1ee820ebc167efc2fe9"
    },
    {
      "input": "[1, \"O\"]",
      "output": "0 0",
      "_id": "6817d1ee820ebc167efc2fea"
    },
    {
      "input": "[4, \"OOOO\"]",
      "output": "0 0",
      "_id": "6817d1ee820ebc167efc2feb"
    },
    {
      "input": "[5, \"OEOEO\"]",
      "output": "1 2",
      "_id": "6817d1ee820ebc167efc2fec"
    },
    {
      "input": "[7, \"OEEEOEE\"]",
      "output": "1 3",
      "_id": "6817d1ee820ebc167efc2fed"
    },
    {
      "input": "[6, \"EOEOEO\"]",
      "output": "1 2",
      "_id": "6817d1ee820ebc167efc2fee"
    }
  ],
  "starterCode": "function solveSeatingArrangement(n, seats) {\n}",
  "suggestedApproach": "This is a greedy problem where you need to find all possible positions where occupied seats can be grouped together. For each position, calculate the minimum moves needed to group the occupied seats. Keep track of the minimum moves and count how many ways you can achieve that minimum.",
  "__v": 0
}];

const importProblems = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing problems
    await Problem.deleteMany({});
    console.log('Cleared existing problems');

    // Insert new problems
    const result = await Problem.insertMany(problemData);
    console.log(`Successfully imported ${result.length} problems`);

    // Verify the import
    const count = await Problem.countDocuments();
    console.log(`Total problems in database: ${count}`);

  } catch (error) {
    console.error('Error importing problems:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
};

// Run the import
importProblems(); 