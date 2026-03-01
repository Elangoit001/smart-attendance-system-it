const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const updateHOD = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Atlas for HOD update.');

        const result = await User.updateOne(
            { registerNumber: 'HOD001' },
            { $set: { name: 'DR. MYTILY (HOD)' } }
        );

        if (result.modifiedCount > 0) {
            console.log('HOD name updated successfully to DR. MYTILY (HOD)');
        } else {
            console.log('No user found with Register Number HOD001 to update.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Update failed:', error);
        process.exit(1);
    }
};

updateHOD();
