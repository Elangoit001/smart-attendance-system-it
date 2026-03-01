const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');
        const users = await User.find({}).limit(5);
        console.log('Total users:', await User.countDocuments({}));
        users.forEach(u => {
            console.log(`- ${u.name} [ID: ${u.registerNumber}, Role: ${u.role}, Email: ${u.email}]`);
        });
        process.exit(0);
    } catch (err) {
        console.error('Check failed:', err);
        process.exit(1);
    }
}

check();
