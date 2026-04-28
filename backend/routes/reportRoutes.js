const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/reportController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/dashboard', authorizeRoles('Admin', 'Manager'), getDashboardStats);

module.exports = router;
