const express = require('express');
const router  = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { addSubmission, getSubmissions } = require('../controllers/submissionController');

// All submission routes require authentication
router.use(authMiddleware);

router.post('/', addSubmission);
router.get('/',  getSubmissions);

module.exports = router;
