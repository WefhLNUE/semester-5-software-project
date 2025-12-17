import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { seedLeaveManagement } from './src/leaves/seed';

dotenv.config();

async function runLeaveSeed() {
  try {
    console.log('🌱 Starting Leave Management seed...');
    console.log('📡 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hr-system');
    console.log('✅ Connected to MongoDB');

    // You may need to fetch employees from your database
    // For now, we'll seed just the leave types and policies
    const connection = mongoose.connection;
    const EmployeeModel = connection.model('Employee', new mongoose.Schema({}, { strict: false }), 'employees');
    const employees = await EmployeeModel.find().limit(50);
    
    console.log(`Found ${employees.length} employees`);

    await seedLeaveManagement(connection, employees, []);

    console.log('✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

runLeaveSeed();
