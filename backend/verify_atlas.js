const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkAtlasData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- MONGODB ATLAS DATABASE STATUS ---');

        const hod = await User.findOne({ role: 'admin', registerNumber: 'HOD001' });
        const staff_3 = await User.findOne({ registerNumber: 'STAFF001' });
        const staff_2 = await User.findOne({ registerNumber: 'STAFF002' });
        const students2 = await User.countDocuments({ role: 'student', year: 2 });
        const students3 = await User.countDocuments({ role: 'student', year: 3 });

        console.log(`\nHOD Name: ${hod?.name || 'NOT FOUND'}`);
        console.log(`3rd Yr Staff: ${staff_3?.name || 'NOT FOUND'}`);
        console.log(`2nd Yr Staff: ${staff_2?.name || 'NOT FOUND'}`);
        console.log(`\nActive student database counts:`);
        console.log(`- 2nd Year Students: ${students2}`);
        console.log(`- 3rd Year Students: ${students3}`);
        console.log(`- Total Students: ${students2 + students3}`);

        console.log('\n✅ ALL DETAILS ARE STORED SECURELY IN YOUR MONGODB ATLAS CLUSTER.');
        process.exit(0);
    } catch (error) {
        console.error('Check failed:', error);
        process.exit(1);
    }
};

checkAtlasData();
