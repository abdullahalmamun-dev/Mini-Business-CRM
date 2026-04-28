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

    const [[{ avgResponse }]] = await pool.query(`
      SELECT AVG(TIMESTAMPDIFF(HOUR, c.created_at, a.min_date)) as avgResponse 
      FROM customers c 
      JOIN (SELECT customer_id, MIN(activity_date) as min_date FROM activities GROUP BY customer_id) a 
      ON c.id = a.customer_id
    `);

    const [[{ conversionRate }]] = await pool.query(`
      SELECT (COUNT(CASE WHEN s.name = 'Won' THEN 1 END) / COUNT(*)) * 100 as conversionRate 
      FROM customers c 
      JOIN customer_statuses s ON c.status_id = s.id
    `);

    const [[{ activeCampaigns }]] = await pool.query(`
      SELECT COUNT(DISTINCT source) as activeCampaigns FROM customers WHERE created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    const [[{ retentionScore }]] = await pool.query(`
      SELECT (COUNT(DISTINCT customer_id) / (SELECT COUNT(*) FROM customers)) * 10 as retentionScore 
      FROM activities 
      WHERE activity_date > DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    res.status(200).json({
      summary: {
        totalCustomers,
        totalTasks,
        pendingTasks,
        avgResponse: Math.round((avgResponse || 1.2) * 10) / 10,
        conversionRate: Math.round(conversionRate || 0),
        activeCampaigns: activeCampaigns || 0,
        retentionScore: Math.round((retentionScore || 0) * 10) / 10
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
