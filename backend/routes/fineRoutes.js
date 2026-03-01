const express = require('express');
const router = express.Router();
const fineController = require('../controllers/fineController');
const { authorize } = require('../middleware/auth');

router.post('/add', authorize(['admin']), fineController.addFine);
router.get('/my-fines', authorize(['student']), fineController.getMyFines);
router.get('/all', authorize(['admin']), fineController.getAllFines);

module.exports = router;
