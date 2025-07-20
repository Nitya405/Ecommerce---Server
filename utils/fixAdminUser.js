import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

async function fixAdminUser() {
  await mongoose.connect(mongoURI);
  const email = 'nityasreevd.23bir@kongu.edu';
  const password = 'Nitya@0405';
  const name = 'Nityasree';
  const role = 'admin';
  const isVerified = true;

  let user = await User.findOne({ email });

  if (user) {
    user.name = name;
    user.password = password; // plain text, will be hashed by pre-save hook
    user.role = role;
    user.isVerified = isVerified;
    await user.save();
    console.log('✅ Admin user updated.');
  } else {
    await User.create({ name, email, password, role, isVerified });
    console.log('✅ Admin user created.');
  }
  const updatedUser = await User.findOne({ email });
  console.log('Admin user document:', updatedUser);
  await mongoose.disconnect();
}

fixAdminUser().catch(e => { console.error(e); process.exit(1); }); 