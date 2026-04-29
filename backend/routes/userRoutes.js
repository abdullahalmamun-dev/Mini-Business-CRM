const express = require('express');
const router = express.Router();
const { getStaff, updateProfile, updatePassword } = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/staff', authorizeRoles('Admin', 'Manager'), getStaff);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);

module.exports = router;
