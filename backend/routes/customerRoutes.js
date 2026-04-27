const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
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

router.use(verifyToken);

router.route('/')
  .get(getCustomers)
  .post(customerValidation, createCustomer);

router.route('/:id')
  .get(getCustomerById)
  .put(customerValidation, updateCustomer)
  .delete(authorizeRoles('Admin'), deleteCustomer);

module.exports = router;
