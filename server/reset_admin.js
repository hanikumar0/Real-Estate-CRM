import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminEmail = 'admin@estateflow.com';
    const newPassword = 'adminpassword123';

    const admin = await User.findOne({ email: adminEmail });
    if (admin) {
      // The pre-save hook in User model will hash this automatically
      admin.password = newPassword;
      admin.role = 'ADMIN';
      await admin.save();
      console.log('✅ Admin credentials updated.');
    } else {
      const newAdmin = new User({
        name: 'System Administrator',
        email: adminEmail,
        password: newPassword,
        role: 'ADMIN'
      });
      await newAdmin.save();
      console.log('✅ New Admin user created.');
    }

    console.log('-------------------------------');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${newPassword}`);
    console.log('-------------------------------');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

resetAdmin();
