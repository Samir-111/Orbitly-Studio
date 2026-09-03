import mongoose from 'mongoose';

// Connect to MongoDB database using Mongoose
export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/orbitly_studio';
    
    // Connect with standard mongoose connection options
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error('[Database] MongoDB connection error:', error);
    // Exit process with failure code if database fails to connect
    process.exit(1);
  }
};
