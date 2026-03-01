const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { authorize } = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/apply', authorize(['student']), upload.single('proof'), leaveController.applyLeave);
router.get('/my-leaves', authorize(['student']), leaveController.getMyLeaves);
router.get('/all', authorize(['admin']), leaveController.getAllLeaves);
router.put('/update', authorize(['admin']), leaveController.updateLeaveStatus);

module.exports = router;
