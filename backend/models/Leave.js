const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Leave', 'OD'], required: true },
    reason: { type: String, required: true },
    proofFile: { type: String }, // Path to file stored on server/cloud
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
