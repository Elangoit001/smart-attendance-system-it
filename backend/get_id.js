const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const findIds = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const students = await User.find({ role: 'student' }).limit(5);
    students.forEach(s => console.log(`${s.name}: ${s._id}`));
    process.exit(0);
};

findIds();
