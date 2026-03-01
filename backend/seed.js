const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedData = async () => {
    try {
        console.log('--- STARTING SEEDING PROCESS ---');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Atlas Connected Successfully.');

        // Clear existing users
        await User.deleteMany({});
        console.log('Database cleared of existing users.');

        // 1. Create 3 Admins (1 HOD, 2 Staff)
        const admins = [
            {
                name: 'DR. MYTHILY (HOD)',
                registerNumber: 'HOD001',
                email: 'hod@college.edu',
                password: 'HODPassword123',
                role: 'admin'
            },
            {
                name: 'GAYATHRI (3rd Yr Staff)',
                registerNumber: 'STAFF001',
                email: 'staff1@college.edu',
                password: 'Staff1Password',
                role: 'admin'
            },
            {
                name: 'SUGANYA (2nd Yr Staff)',
                registerNumber: 'STAFF002',
                email: 'staff2@college.edu',
                password: 'Staff2Password',
                role: 'admin'
            }
        ];

        for (const admin of admins) {
            await new User(admin).save();
        }
        console.log('3 Admins created in Atlas.');

        // 2. Create 3rd Year Students (28 students) [22IT3...]
        for (let i = 1; i <= 28; i++) {
            const rollSuffix = i.toString().padStart(3, '0');
            const rollIdSuffix = rollSuffix.slice(-2); // Last 2 digits
            const rollNumber = `22IT3${rollSuffix}`; // e.g., 22IT3001
            const name = `Student ${i}`;
            const password = `${name}${rollIdSuffix}`; // Password: Name + Last 2 (e.g. Student 101)

            const student = {
                name: name,
                registerNumber: rollNumber,
                email: `student3_${i}@college.edu`,
                password: password,
                role: 'student',
                year: 3
            };
            await new User(student).save();
        }
        console.log('28 3rd Year Students created.');

        // 3. Create 2nd Year Students (30 students) [22IT2...]
        for (let i = 1; i <= 30; i++) {
            const rollSuffix = i.toString().padStart(3, '0');
            const rollIdSuffix = rollSuffix.slice(-2); // Last 2 digits
            const rollNumber = `22IT2${rollSuffix}`; // e.g., 22IT2001
            const name = `Student ${i + 30}`; // Different names for second batch
            const password = `${name}${rollIdSuffix}`; // Password: Name + Last 2

            const student = {
                name: name,
                registerNumber: rollNumber,
                email: `student2_${i}@college.edu`,
                password: password,
                role: 'student',
                year: 2
            };
            await new User(student).save();
        }
        console.log('30 2nd Year Students created.');
        console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
        process.exit(0);
    } catch (error) {
        console.error('CRITICAL SEEDING ERROR:', error);
        process.exit(1);
    }
};

seedData();
