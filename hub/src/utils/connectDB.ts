import mongoose from 'mongoose';
import "dotenv/config";




export const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGODB_URL as string, {
      
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error:any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};