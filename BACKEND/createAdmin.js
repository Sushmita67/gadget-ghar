const mongoose = require('mongoose');
const Admin = require('./models/admin');
require('dotenv').config();

async function createDefaultAdmin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gadgetghar');
    console.log('Connected to database');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin account already exists');
      console.log('Username: admin');
      console.log('Password: admin123');
      return;
    }

    // Create default admin
    const admin = new Admin({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Default admin account created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

createDefaultAdmin(); 