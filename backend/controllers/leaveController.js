const Leave = require('../models/Leave');
const AuditLog = require('../models/AuditLog');
const { sendLeaveEmail } = require('../services/mailService');
const User = require('../models/User');

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

        // --- EMAIL NOTIFICATION ---
        try {
            const student = await User.findById(req.user.id);
            if (student) {
                await sendLeaveEmail(
                    student.name,
                    student.registerNumber,
                    type,
                    reason,
                    startDate,
                    endDate,
                    newLeave._id
                );
            }
        } catch (mailError) {
            console.error('Non-blocking Email Error:', mailError.message);
        }
        // -------------------------

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
        res.status(500).json(leaves);
    }
};

// Direct Action from Email (GET)
exports.directAction = async (req, res) => {
    try {
        const { id, status } = req.params; // status: 'Approved' or 'Rejected'
        const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });

        if (!leave) return res.send(`
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: #f43f5e;">Error!</h1>
                <p>Leave request not found or might have been deleted.</p>
            </div>
        `);

        res.send(`
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #020617; color: white; min-height: 100vh;">
                <h1 style="color: ${status === 'Approved' ? '#10b981' : '#f43f5e'}; font-size: 48px;">${status}!</h1>
                <p style="font-size: 18px; color: #94a3b8;">The leave request for <strong>${id}</strong> has been successfully <strong>${status.toLowerCase()}</strong>.</p>
                <div style="margin-top: 30px;">
                    <a href="https://chilly-actors-admire.loca.lt/admin/leaves" style="background: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Return to Management Portal</a>
                </div>
            </div>
        `);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};
