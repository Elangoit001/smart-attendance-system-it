const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();
const port = process.env.PORT || 5000;
console.log('--- Server initializing ---');

// Middleware
app.use(express.json());
app.use(cors());

// Log incoming requests
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} [${res.statusCode}] - ${duration}ms`);
    });
    next();
});

// Route Mounts
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/leave', require('./routes/leaveRoutes'));
app.use('/api/fine', require('./routes/fineRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));
console.log('--- Routes mounted ---');

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Production Settings: Serve React Frontend
if (process.env.NODE_ENV === 'production') {
    const frontendDist = path.join(__dirname, '../frontend/dist');
    app.use(express.static(frontendDist));

    // Handle React routing, return all non-api requests to React app
    app.get('/:path*', (req, res) => {
        if (!req.url.startsWith('/api')) {
            res.sendFile(path.join(frontendDist, 'index.html'));
        }
    });
} else {
    // Health check route for dev
    app.get('/', (req, res) => {
        res.send('Smart Attendance System Backend Running on MongoDB Atlas');
    });
}

// Generic Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
console.log('--- app.listen() called ---');
