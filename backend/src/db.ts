import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Department, DepartmentSchema } from './organization-structure/Models/department.schema';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Successfully connected to MongoDB");
    if (mongoose.connection.db) {
      console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    }

    // Register Department globally before Position schema loads
    // This ensures Position schema's pre-save hook can access Department model
    if (!mongoose.models[Department.name]) {
      mongoose.model(Department.name, DepartmentSchema);
    }

    // Set up connection event listeners after connection
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB");
    console.error("Error details:", err);
    process.exit(1);
  }
};

export default connectDB;
