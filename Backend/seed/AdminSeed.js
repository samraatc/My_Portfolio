// seedAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js'; // Adjust the path as necessary

dotenv.config({path: '../.env'}); // Adjust the path to your .env file

const MONGO_URL = process.env.MONGO_URL;

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB for seeding.');

    const adminData = {
      name: 'Admin',
      email: 'sbishnu0031@gmail.com',
      password: 'Bishnu123', // Will be hashed by your User schema pre-save middleware
      phoneNo: 9148174899,
      title: 'MERN stack developer | DevOps',
      bio: 'Main admin user',
      address: 'Bangalore',
      socialMedia: [],
    };

    // Check if admin already exists
    const exists = await User.findOne({ email: adminData.email });
    if (exists) {
      console.log('Admin user already exists.');
    } else {
      const user = new User(adminData);
      await user.save();
      console.log('Admin user created.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedAdmin();
