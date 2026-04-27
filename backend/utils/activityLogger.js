const pool = require('../config/db');

const logActivity = async (customerId, staffId, type, notes) => {
  try {
    await pool.query(
      `INSERT INTO activities (customer_id, assigned_staff_id, activity_type, notes, activity_date) VALUES (?, ?, ?, ?, CURDATE())`,
      [customerId, staffId, type, notes]
    );
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

module.exports = { logActivity };
