const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { login } = require('../controllers/authController');

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail().normalizeEmail().trim().escape(),
    check('password', 'Password is required').notEmpty().trim()
  ],
  login
);

module.exports = router;
