const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');
const Product = require('./models/product');
const Admin = require('./models/admin');
const { encrypt } = require('./utils/encryption');
const bcrypt = require('bcryptjs');
const { logger } = require('./utils/logger');

dotenv.config();

const users = [
  {
    fullName: 'Sushmita B',
    email: 'admin@gadgetghar.com',
    password: 'Admin@1234',
    role: 'admin',
    phone: '9876543210'
  },
  {
    fullName: 'Apekshya',
    email: 'apekshya@yopmail.com',
    password: 'Customer@1234',
    role: 'user',
    phone: '9123456780'
  }
];

const admins = [
  {
    username: 'admin',
    password: 'Admin@1234',
    role: 'admin'
  }
];

const products = [
  {
    name: 'Super Quality Earpods',
    price: 4999,
    description: 'A high-quality earpods for.',
    stock: 5,
    images: [
      { url: '/uploads/image1.jpg' },
      { url: '/uploads/image2.jpg' }
    ],
    colors: ['Black', 'White'],
    category: 'Keyboard',
  },
  {
    name: 'Smart Glasses',
    price: 1999,
    description: 'Ergonomic wireless glass with long battery life.',
    stock: 7,
    images: [
      { url: '/uploads/image3.jpg' },
      { url: '/uploads/image4.jpg' }
    ],
    colors: ['Black', 'Blue'],
    category: 'Mouse',
  },
  {
    name: 'Smart Watch',
    price: 2999,
    description: 'Super smart watch with noise-cancelling mic.',
    stock: 12,
    images: [
      { url: '/uploads/image5.jpg' },
      { url: '/uploads/image6.jpg' }
    ],
    colors: ['Red', 'Black'],
    category: 'Headset',
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    logger.info('Connected to MongoDB for seeding.');

    // Drop obsolete emailHash index if it exists
    try {
      await mongoose.connection.db.collection('users').dropIndex('emailHash_1');
      logger.info('Dropped obsolete emailHash index.');
    } catch (e) {
      if (!e.message.includes('index not found')) {
        logger.error('Error dropping emailHash index:', e);
      }
    }

    // Seed admins - NO manual hashing, let the model handle it
    await Admin.deleteMany({});
    logger.info('Cleared Admin collection.');

    for (const a of admins) {
      const admin = new Admin(a);
      console.log('Seeding admin:', admin);
      await admin.save(); // Model will hash password automatically
      logger.info(`Seeded admin: ${a.username}`);
    }

    await User.deleteMany({});
    logger.info('Cleared User collection.');

    for (const u of users) {
      const hashedPassword = await bcrypt.hash(u.password, 12);
      const user = new User({
        ...u,
        password: hashedPassword,
        phone: encrypt(u.phone)
      });
      console.log('Seeding user:', user);
      await user.save();
      logger.info(`Seeded user: ${u.email}`);
    }

    await Product.deleteMany({});
    logger.info('Cleared Product collection.');

    for (const p of products) {
      const product = new Product(p);
      await product.save();
      logger.info(`Seeded product: ${p.name}`);
    }

    logger.info('Seeding complete.');
    console.log('\n=== SEEDING COMPLETE ===');
    console.log('Admin Credentials:');
    console.log('Username: admin');
    console.log('Password: Admin@1234');
    console.log('=======================\n');
    process.exit(0);
  } catch (err) {
    logger.error('Seeding error:', err);
    process.exit(1);
  }
}

seed(); 