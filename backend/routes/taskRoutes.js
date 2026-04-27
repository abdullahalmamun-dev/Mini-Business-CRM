const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(verifyToken);

// Global task routes
router.get('/', getTasks);

const taskValidation = [
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed', 'Cancelled']).withMessage('Invalid status'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority')
];

router.route('/:taskId')
  .put(taskValidation, updateTask)
  .delete(authorizeRoles('Admin'), deleteTask);

module.exports = router;
