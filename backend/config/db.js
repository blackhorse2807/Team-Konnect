const mongoose = require('mongoose');

// MongoDB connection string with proper parameters and no deprecated options
const MONGO_URI = 'mongodb+srv://ujjwalkumar0149_db_user:eFw6gi0hwEaJv1oy@cluster0.lm4eddu.mongodb.net/meesho-app?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    // Remove deprecated options - they're not needed in newer versions
    const conn = await mongoose.connect(MONGO_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
