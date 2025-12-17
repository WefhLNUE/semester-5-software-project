// Get full employee details including credentials
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGO_URI;

async function getEmployeeDetails() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const db = mongoose.connection.db;
    const employees = await db.collection('employees').find({}).toArray();
    
    console.log('👥 EXISTING EMPLOYEES:\n');
    employees.forEach(emp => {
      console.log(`Email: ${emp.email || emp.workEmail}`);
      console.log(`Employee#: ${emp.employeeNumber}`);
      console.log(`Name: ${emp.name || emp.firstName + ' ' + emp.lastName}`);
      console.log(`Password: ${emp.password ? '(hashed)' : 'NOT SET'}`);
      console.log(`ID: ${emp._id}`);
      console.log(`---`);
    });
    
    // Check employee_profiles collection
    const profiles = await db.collection('employee_profiles').find({}).toArray();
    if (profiles.length > 0) {
      console.log('\n📋 EMPLOYEE PROFILES:\n');
      profiles.forEach(prof => {
        console.log(`Email: ${prof.workEmail || prof.email}`);
        console.log(`Employee#: ${prof.employeeNumber}`);
        console.log(`ID: ${prof._id}`);
        console.log(`---`);
      });
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

getEmployeeDetails();
