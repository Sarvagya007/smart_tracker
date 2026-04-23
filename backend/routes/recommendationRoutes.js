const express = require('express');
const router  = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getRecommendations } = require('../controllers/recommendationController');

router.use(authMiddleware);

router.get('/', getRecommendations);

module.exports = router;
