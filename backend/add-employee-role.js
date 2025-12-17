// MongoDB Script to Add Employee Role to User
// Run this with: node add-employee-role.js

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Define schemas
const EmployeeProfileSchema = new mongoose.Schema({
  workEmail: String,
  firstName: String,
  lastName: String,
}, { collection: 'employeeprofiles' });

const EmployeeSystemRoleSchema = new mongoose.Schema({
  employeeProfileId: mongoose.Schema.Types.ObjectId,
  roles: [String],
  permissions: [String],
}, { collection: 'employeesystemroles' });

const EmployeeProfile = mongoose.model('EmployeeProfile', EmployeeProfileSchema);
const EmployeeSystemRole = mongoose.model('EmployeeSystemRole', EmployeeSystemRoleSchema);

async function addEmployeeRole(email, roleToAdd = 'DEPARTMENT_EMPLOYEE') {
  try {
    // Find employee
    const employee = await EmployeeProfile.findOne({ workEmail: email });
    if (!employee) {
      console.error(`❌ Employee with email ${email} not found`);
      return;
    }

    console.log(`✅ Found employee: ${employee.firstName} ${employee.lastName} (${employee.workEmail})`);

    // Find or create system role
    let systemRole = await EmployeeSystemRole.findOne({ employeeProfileId: employee._id });

    if (!systemRole) {
      console.log('📝 Creating new system role document...');
      systemRole = new EmployeeSystemRole({
        employeeProfileId: employee._id,
        roles: [roleToAdd],
        permissions: [],
      });
      await systemRole.save();
      console.log(`✅ Created system role with ${roleToAdd}`);
    } else {
      console.log('📝 System role exists. Current roles:', systemRole.roles);
      
      if (!systemRole.roles.includes(roleToAdd)) {
        systemRole.roles.push(roleToAdd);
        await systemRole.save();
        console.log(`✅ Added ${roleToAdd} to existing roles`);
      } else {
        console.log(`ℹ️  User already has ${roleToAdd} role`);
      }
    }

    console.log('✅ Final roles:', systemRole.roles);
    console.log('\n🎉 Done! User can now access the Leaves module.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Get email from command line or use default
const email = process.argv[2] || 'kanzy@example.com';
const role = process.argv[3] || 'DEPARTMENT_EMPLOYEE';

console.log(`\n🔧 Adding ${role} role to ${email}...\n`);
addEmployeeRole(email, role);
