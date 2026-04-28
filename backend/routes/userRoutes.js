const express = require('express');
const router = express.Router();
const { getStaff } = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/staff', authorizeRoles('Admin', 'Manager'), getStaff);

module.exports = router;
