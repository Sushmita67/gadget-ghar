const mongoose = require('mongoose');
const Admin = require('./models/admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkAdmin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gadgetghar');
    console.log('Connected to database');

    // Find admin
    const admin = await Admin.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('❌ No admin found with username: admin');
      return;
    }

    console.log('✅ Admin found:');
    console.log('Username:', admin.username);
    console.log('Role:', admin.role);
    console.log('Password hash:', admin.password.substring(0, 20) + '...');
    console.log('Created at:', admin.createdAt);

    // Test password
    const testPassword = 'Admin@1234';
    const isValid = await bcrypt.compare(testPassword, admin.password);
    
    console.log('\n🔐 Password Test:');
    console.log('Test password:', testPassword);
    console.log('Password valid:', isValid ? '✅ YES' : '❌ NO');

    if (!isValid) {
      console.log('\n🔍 Debugging:');
      console.log('Let\'s try to recreate the admin...');
      
      // Delete existing admin
      await Admin.deleteOne({ username: 'admin' });
      
      // Create new admin
      const newAdmin = new Admin({
        username: 'admin',
        password: 'Admin@1234',
        role: 'admin'
      });
      
      await newAdmin.save();
      console.log('✅ New admin created with password: Admin@1234');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

checkAdmin(); 