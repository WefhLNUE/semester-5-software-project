// Quick script to check if employee exists
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hrms';

async function checkEmployee() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log('📍 Database:', mongoose.connection.db.databaseName);
    
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📚 Found ${collections.length} collections:`);
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Try different possible collection names
    const possibleNames = ['employee_profiles', 'employeeprofiles', 'employees', 'EmployeeProfiles', 'Employees'];
    
    for (const name of possibleNames) {
      const count = await db.collection(name).countDocuments();
      if (count > 0) {
        console.log(`\n✅ Found ${count} documents in '${name}' collection`);
        const employees = await db.collection(name).find({}).limit(5).toArray();
        employees.forEach(emp => {
          console.log(`  - ${emp.workEmail || emp.email} (${emp.employeeNumber}) - ID: ${emp._id}`);
        });
      }
    }
    
    // Check for test user in any employee collection
    for (const name of possibleNames) {
      const testUser = await db.collection(name).findOne({ 
        $or: [
          { workEmail: 'engemp1.work@example.com' },
          { email: 'engemp1.work@example.com' }
        ]
      });
      
      if (testUser) {
        console.log(`\n✅ Test user found in '${name}' collection!`);
        console.log('   Employee ID:', testUser._id);
        console.log('   Name:', testUser.name || testUser.firstName);
        console.log('   Full document:', JSON.stringify(testUser, null, 2));
        break;
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkEmployee();
