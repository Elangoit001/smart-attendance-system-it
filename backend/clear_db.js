const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const clear = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');
        await mongoose.connection.db.collection('users').deleteMany({});
        console.log('Collection users cleared.');
        process.exit(0);
    } catch (err) {
        console.error('Clear failed:', err);
        process.exit(1);
    }
}

clear();
