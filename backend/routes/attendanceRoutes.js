const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authorize } = require('../middleware/auth');

router.post('/mark', authorize(['admin']), attendanceController.markAttendance);
router.get('/percentage', authorize(['admin', 'student']), attendanceController.getAttendancePercentage);
router.get('/percentage/:studentId', authorize(['admin', 'student']), attendanceController.getAttendancePercentage);
router.get('/my-attendance', authorize(['student']), attendanceController.getMyAttendance);
router.get('/stats', authorize(['admin']), attendanceController.getAdminStats);
router.get('/by-date/:date', authorize(['admin']), attendanceController.getAttendanceByDate);
router.get('/report', authorize(['admin']), attendanceController.getMonthlyReport);
router.get('/student-list', authorize(['admin']), attendanceController.getStudentList);
router.get('/summaries', authorize(['admin']), attendanceController.getDailySummaries);
router.get('/unauthorized', authorize(['admin']), attendanceController.getUnauthorizedAbsences);

module.exports = router;
