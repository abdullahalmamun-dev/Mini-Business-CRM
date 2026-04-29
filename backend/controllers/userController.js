const pool = require('../config/db');
const { hashPassword } = require('../utils/passwordUtils');

const getStaff = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT u.id, u.name, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name != "Admin"'
    );
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, req.user.id]);
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // 1. Get current user
    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const user = users[0];

    // 2. Hash and update
    const hashed = await hashPassword(newPassword);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStaff, updateProfile, updatePassword };
