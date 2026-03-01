const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Attendance = require('./models/Attendance');
const User = require('./models/User');

dotenv.config();

const fullCheck = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find().limit(20);
        console.log('--- Current Users in DB ---');
        users.forEach(u => console.log(`${u.name} (ID: ${u._id}, Role: ${u.role}, Reg: ${u.registerNumber})`));

        const attendance = await Attendance.find().sort({ date: -1 });
        console.log(`--- Attendance Records (${attendance.length}) ---`);
        for (const a of attendance) {
            const student = await User.findById(a.studentId);
            console.log(`${a.date.toDateString()}: ${student ? student.name : 'UNKNOWN'} (${a.studentId}) -> ${a.status}`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fullCheck();
