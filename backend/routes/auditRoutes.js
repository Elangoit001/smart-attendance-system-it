const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { authorize } = require('../middleware/auth');

router.get('/all', authorize(['admin']), auditController.getAllAuditLogs);

module.exports = router;
