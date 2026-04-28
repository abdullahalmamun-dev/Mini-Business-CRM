const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  exportCustomers
} = require('../controllers/customerController');
const { getTasksByCustomer, createTask } = require('../controllers/taskController');
const { getActivitiesByCustomer, createActivity } = require('../controllers/activityController');
const { body } = require('express-validator');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const customerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional({ checkFalsy: true }).trim().isMobilePhone().withMessage('Valid phone number is required'),
  body('company').optional({ checkFalsy: true }).trim(),
  body('status_id').optional().isInt().withMessage('Status ID must be an integer'),
  body('assigned_staff_id').optional({ nullable: true }).isInt().withMessage('Staff ID must be an integer')
];

const taskValidation = [
  body('task_type').notEmpty().withMessage('Task type is required'),
  body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
  body('due_date').isDate().withMessage('Valid due date is required')
];

router.use(verifyToken);

// Customer-specific Tasks & Activities
router.route('/:id/tasks')
  .get(getTasksByCustomer)
  .post(taskValidation, createTask);

router.route('/:id/activities')
  .get(getActivitiesByCustomer)
  .post(createActivity);

router.get('/export', exportCustomers);

router.route('/')
  .get(getCustomers)
  .post(customerValidation, createCustomer);

router.route('/:id')
  .get(getCustomerById)
  .put(customerValidation, updateCustomer)
  .delete(authorizeRoles('Admin'), deleteCustomer);

module.exports = router;
