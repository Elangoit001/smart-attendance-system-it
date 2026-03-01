const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const updateAdminNames = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Atlas for Admin update.');

        // Update HOD
        await User.updateOne(
            { registerNumber: 'HOD001' },
            { $set: { name: 'DR. MYTHILY (HOD)' } }
        );
        console.log('HOD name updated to DR. MYTHILY (HOD)');

        // Update 3rd Year Staff
        await User.updateOne(
            { registerNumber: 'STAFF001' },
            { $set: { name: 'GAYATHRI (3rd Yr Staff)' } }
        );
        console.log('3rd Year Staff updated to GAYATHRI');

        // Update 2nd Year Staff
        await User.updateOne(
            { registerNumber: 'STAFF002' },
            { $set: { name: 'SUGANYA (2nd Yr Staff)' } }
        );
        console.log('2nd Year Staff updated to SUGANYA');

        console.log('--- ALL ADMIN SUCCESSFUL UPDATES ---');
        process.exit(0);
    } catch (error) {
        console.error('Update failed:', error);
        process.exit(1);
    }
};

updateAdminNames();
