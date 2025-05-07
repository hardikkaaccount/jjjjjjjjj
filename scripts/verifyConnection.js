require('dotenv').config();
const mongoose = require('mongoose');

const verifyConnection = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    console.log('Successfully connected to MongoDB Atlas');

    // Get database stats
    const stats = await mongoose.connection.db.stats();
    console.log('\nDatabase Statistics:');
    console.log('Collections:', stats.collections);
    console.log('Documents:', stats.objects);
    console.log('Data Size:', (stats.dataSize / 1024 / 1024).toFixed(2), 'MB');
    console.log('Storage Size:', (stats.storageSize / 1024 / 1024).toFixed(2), 'MB');

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Close the connection
    await mongoose.connection.close();
    console.log('\nConnection closed successfully');

  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  }
};

verifyConnection(); 