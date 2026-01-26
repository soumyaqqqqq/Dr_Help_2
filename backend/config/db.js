import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Keep dotenv here if it's needed for independent execution, though usually managed at entry
// However, since we want specific patterns, let's assume dotenv is loaded at app entry, 
// BUT for safety in independent modules or tests, we might check process.env.
// The plan said "Ensure dotenv is initialized only once at the entry point".
// So I will NOT import dotenv here, assuming it's loaded in index.js

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/painsense';
    
    await mongoose.connect(MONGO_URI);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
