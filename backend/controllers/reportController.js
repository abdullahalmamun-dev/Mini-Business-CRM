const pool = require('../config/db');

const getDashboardStats = async (req, res, next) => {
  try {
    const [[{ totalCustomers }]] = await pool.query('SELECT COUNT(*) as totalCustomers FROM customers');
    const [[{ totalTasks }]] = await pool.query('SELECT COUNT(*) as totalTasks FROM tasks');
    const [[{ pendingTasks }]] = await pool.query('SELECT COUNT(*) as pendingTasks FROM tasks WHERE status != "Completed"');

    const [statusStats] = await pool.query(`
      SELECT s.name, COUNT(c.id) as count 
      FROM customer_statuses s 
      LEFT JOIN customers c ON s.id = c.status_id 
      GROUP BY s.id, s.name
    `);

    const [staffStats] = await pool.query(`
      SELECT u.name, COUNT(c.id) as count 
      FROM users u 
      LEFT JOIN customers c ON u.id = c.assigned_staff_id 
      WHERE u.role_id IN (SELECT id FROM roles WHERE name IN ('Manager', 'Staff'))
      GROUP BY u.id, u.name
      HAVING count > 0
    `);

    const [recentCustomers] = await pool.query(`
      SELECT c.*, s.name as status_name 
      FROM customers c 
      LEFT JOIN customer_statuses s ON c.status_id = s.id 
      ORDER BY c.created_at DESC 
      LIMIT 5
    `);

    const [priorityStats] = await pool.query(`
      SELECT priority, COUNT(*) as count 
      FROM tasks 
      WHERE status != 'Completed' 
      GROUP BY priority
    `);

    const [staffProductivity] = await pool.query(`
      SELECT u.name, COUNT(t.id) as count 
      FROM users u 
      JOIN tasks t ON u.id = t.assigned_staff_id 
      WHERE t.status = 'Completed' 
      GROUP BY u.id, u.name
    `);

    const [tasksDueToday] = await pool.query(`
      SELECT t.*, c.name as customer_name 
      FROM tasks t 
      JOIN customers c ON t.customer_id = c.id 
      WHERE DATE(t.due_date) = CURDATE() AND t.status != 'Completed'
      LIMIT 5
    `);

    const [growthStats] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%b %Y') as month, COUNT(*) as count 
      FROM customers 
      GROUP BY DATE_FORMAT(created_at, '%Y-%m'), month 
      ORDER BY DATE_FORMAT(created_at, '%Y-%m') ASC 
      LIMIT 12
    `);

    res.status(200).json({
      summary: {
        totalCustomers,
        totalTasks,
        pendingTasks
      },
      statusStats,
      staffStats,
      recentCustomers,
      priorityStats,
      staffProductivity,
      tasksDueToday,
      growthStats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
