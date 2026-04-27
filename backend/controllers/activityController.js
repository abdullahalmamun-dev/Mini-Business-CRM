const pool = require('../config/db');

const getActivitiesByCustomer = async (req, res, next) => {
  try {
    const [activities] = await pool.query(
      `SELECT a.*, u.name as staff_name 
       FROM activities a
       LEFT JOIN users u ON a.assigned_staff_id = u.id
       WHERE a.customer_id = ? 
       ORDER BY a.created_at DESC`,
      [req.params.id]
    );
    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};

const createActivity = async (req, res, next) => {
  try {
    const { activity_type, notes } = req.body;
    const customer_id = req.params.id;

    await pool.query(
      `INSERT INTO activities (customer_id, assigned_staff_id, activity_type, notes, activity_date) VALUES (?, ?, ?, ?, CURDATE())`,
      [customer_id, req.user.id, activity_type, notes]
    );

    res.status(201).json({ message: 'Activity logged successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivitiesByCustomer,
  createActivity
};
