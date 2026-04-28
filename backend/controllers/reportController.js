const pool = require('../config/db');

const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Total Stats
    const [[{ totalCustomers }]] = await pool.query('SELECT COUNT(*) as totalCustomers FROM customers');
    const [[{ totalTasks }]] = await pool.query('SELECT COUNT(*) as totalTasks FROM tasks');
    const [[{ pendingTasks }]] = await pool.query('SELECT COUNT(*) as pendingTasks FROM tasks WHERE status != "Completed"');

    // 2. Customers by Status
    const [statusStats] = await pool.query(`
      SELECT s.name, COUNT(c.id) as count 
      FROM customer_statuses s 
      LEFT JOIN customers c ON s.id = c.status_id 
      GROUP BY s.id, s.name
    `);

    // 3. Customers by Staff
    const [staffStats] = await pool.query(`
      SELECT u.name, COUNT(c.id) as count 
      FROM users u 
      LEFT JOIN customers c ON u.id = c.assigned_staff_id 
      WHERE u.role_id IN (SELECT id FROM roles WHERE name IN ('Manager', 'Staff'))
      GROUP BY u.id, u.name
      HAVING count > 0
    `);

    // 4. Recent Customers
    const [recentCustomers] = await pool.query(`
      SELECT c.*, s.name as status_name 
      FROM customers c 
      LEFT JOIN customer_statuses s ON c.status_id = s.id 
      ORDER BY c.created_at DESC 
      LIMIT 5
    `);

    res.status(200).json({
      summary: {
        totalCustomers,
        totalTasks,
        pendingTasks
      },
      statusStats,
      staffStats,
      recentCustomers
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
