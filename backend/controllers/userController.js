const pool = require('../config/db');

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

module.exports = { getStaff };
