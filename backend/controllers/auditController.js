const AuditLog = require('../models/AuditLog');

exports.getAllAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('adminId', 'name registerNumber')
            .sort({ timestamp: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
