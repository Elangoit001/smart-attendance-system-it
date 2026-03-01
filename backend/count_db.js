const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const countStudents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Atlas.');

        const count = await User.countDocuments({});
        console.log(`TOTAL USERS IN DATABASE: ${count}`);

        const admins = await User.find({ role: 'admin' });
        console.log('\nADMINS FOUND:');
        admins.forEach(a => console.log(`- ${a.name} (${a.registerNumber})`));

        const studentsByYear = await User.aggregate([
            { $match: { role: 'student' } },
            { $group: { _id: "$year", total: { $sum: 1 } } }
        ]);

        console.log('\nSTUDENTS BY YEAR:');
        studentsByYear.forEach(s => console.log(`- Year ${s._id}: ${s.total} students`));

        process.exit(0);
    } catch (err) {
        console.error('ERROR COUNTING:', err);
        process.exit(1);
    }
};

countStudents();
