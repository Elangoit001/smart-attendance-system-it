const Leave = require('../models/Leave');
const AuditLog = require('../models/AuditLog');

// Apply for Leave/OD (Student)
exports.applyLeave = async (req, res) => {
    try {
        const { type, reason, startDate, endDate } = req.body;
        const proofFile = req.file ? req.file.path : null;

        const newLeave = new Leave({
            studentId: req.user.id,
            type,
            reason,
            startDate,
            endDate,
            proofFile
        });
        await newLeave.save();

        res.status(201).json({ message: 'Leave/OD applied successfully.', leave: newLeave });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Student's Leave Status
exports.getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ studentId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve/Reject Leave (Admin)
exports.updateLeaveStatus = async (req, res) => {
    try {
        const { leaveId, status } = req.body; // status: 'Approved' or 'Rejected'

        const leave = await Leave.findByIdAndUpdate(leaveId, { status }, { new: true });
        if (!leave) return res.status(404).json({ message: 'Leave request not found.' });

        // Audit Log Entry
        const auditLog = new AuditLog({
            adminId: req.user.id,
            action: `Leave Status Updated to ${status}`,
            targetId: leaveId,
            details: { studentId: leave.studentId, type: leave.type }
        });
        await auditLog.save();

        res.status(200).json({ message: `Leave ${status} successfully.`, leave });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Leave Requests (Admin View)
exports.getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate('studentId', 'name registerNumber').sort({ createdAt: -1 });
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
