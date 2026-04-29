const pool = require('../config/db');
const { comparePassword } = require('../utils/passwordUtils');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    console.log('[Login Debug]: Attempting login for:', email);
    const [users] = await pool.query(
      `SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?`,
      [email]
    );

    if (users.length === 0) {
      console.log('[Login Debug]: No user found with email:', email);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = users[0];
    console.log('[Login Debug]: User found. Comparing password hash...');

    const isMatch = await comparePassword(password, user.password);
    console.log('[Login Debug]: Comparison result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const payload = {
      id: user.id,
      role: user.role_name
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super_secret_key',
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Always true for cross-domain SameSite: None
      sameSite: 'none', // Required for cross-domain cookies
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  login
};
