const express = require('express');
const router  = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getOverview, getWeakTopics } = require('../controllers/analyticsController');

router.use(authMiddleware);

router.get('/overview',     getOverview);
router.get('/weak-topics',  getWeakTopics);

module.exports = router;
