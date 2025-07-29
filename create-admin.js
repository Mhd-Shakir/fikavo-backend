const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const email = 'admin@fikavo.com';
    const password = 'admin123'; // ✅ your desired password

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log('⚠️ Admin already exists');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();
    console.log('✅ Admin created');
    process.exit();
  })
  .catch(err => console.error(err));
