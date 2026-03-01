const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const test = async () => {
    try {
        console.log('Testing connection to:', process.env.MONGO_URI.replace(/\/\/.*@/, '//****:****@'));
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Atlas.');

        const userSchema = new mongoose.Schema({
            name: String,
            email: { type: String, unique: true }
        });
        const TestUser = mongoose.model('TestUser', userSchema);

        console.log('Clearing collection...');
        await TestUser.deleteMany({});

        const user = new TestUser({ name: 'Test', email: 'test@example.com' });
        await user.save();
        console.log('Saved user successfully.');

        process.exit(0);
    } catch (err) {
        console.error('--- TEST FAILED ---');
        console.error(err);
        process.exit(1);
    }
}

test();
