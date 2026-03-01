const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register User (Can be used by an Admin to add students)
exports.registerUser = async (req, res) => {
    try {
        const { name, registerNumber, email, password, role } = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { registerNumber }] });
        if (userExists) return res.status(400).json({ message: 'User already exists with this email or register number.' });

        const newUser = new User({ name, registerNumber, email, password, role });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed.', error: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier can be email or registerNumber

        const user = await User.findOne({ $or: [{ email: identifier }, { registerNumber: identifier }] });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

        const token = generateToken(user);

        // Record Audit Log for Login
        await new AuditLog({
            userId: user._id,
            action: 'LOGIN',
            details: { name: user.name, role: user.role }
        }).save();

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, registerNumber: user.registerNumber, role: user.role }
        });
    } catch (error) {
        console.error('LOGIN ERROR:', error);
        require('fs').appendFileSync('C:/Users/Admin/.gemini/antigravity/scratch/smart-dept-system/backend/login_error_log.txt', `[${new Date().toISOString()}] LOGIN ERROR: ${error.stack}\n`);
        res.status(500).json({ message: 'Login failed.', error: error.message });
    }
};
