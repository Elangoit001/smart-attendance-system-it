const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Atlas Connected.');

        await User.deleteMany({});
        console.log('Cleared Users.');

        const admin = new User({
            name: 'HOD',
            registerNumber: 'HOD001',
            email: 'hod@test.edu',
            password: 'password123',
            role: 'admin'
        });

        console.log('Saving HOD...');
        await admin.save();
        console.log('HOD saved.');

        process.exit(0);
    } catch (err) {
        console.error('SEED FAILED:', err);
        process.exit(1);
    }
}

seed();
