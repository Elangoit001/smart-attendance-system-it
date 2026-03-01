try {
    console.log('Requiring User model...');
    const User = require('./models/User');
    console.log('User model required.');

    console.log('Requiring authController...');
    const authController = require('./controllers/authController');
    console.log('authController required.');

    console.log('Requiring authRoutes...');
    const authRoutes = require('./routes/authRoutes');
    console.log('authRoutes required.');

    console.log('Requiring attendanceRoutes...');
    const attendanceRoutes = require('./routes/attendanceRoutes');
    console.log('attendanceRoutes required.');

    console.log('All required.');
} catch (err) {
    console.error('FAIL:', err);
}
