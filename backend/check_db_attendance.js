const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Attendance = require('./models/Attendance');

dotenv.config();

const checkAttendance = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Attendance.countDocuments();
        console.log(`Total Attendance Records: ${count}`);

        const latest = await Attendance.find().sort({ date: -1 }).limit(5).populate('studentId', 'name registerNumber');
        console.log('Latest 5 records:');
        latest.forEach(r => {
            console.log(`- ${r.date.toDateString()}: ${r.studentId?.name} (${r.studentId?.registerNumber}) -> ${r.status}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkAttendance();
