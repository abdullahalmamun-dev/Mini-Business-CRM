const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

async function seed() {
  console.log('[seeder]: Connecting to database...');
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mini_crm',
    port: process.env.DB_PORT || 3306,
  });

  try {
    // 1. Roles and Statuses
    console.log('[seeder]: Seeding roles and statuses...');
    await pool.query(`INSERT INTO roles (id, name) VALUES (1, 'Admin'), (2, 'Manager'), (3, 'Staff') ON DUPLICATE KEY UPDATE name=VALUES(name)`);
    await pool.query(`INSERT INTO customer_statuses (id, name) VALUES (1, 'New'), (2, 'Contacted'), (3, 'Qualified'), (4, 'Proposal Sent'), (5, 'Won'), (6, 'Lost') ON DUPLICATE KEY UPDATE name=VALUES(name)`);

    // 2. Users
    console.log('[seeder]: Seeding users...');
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);
    
    await pool.query(`INSERT INTO users (id, name, email, password, role_id) VALUES 
      (1, 'Admin User', 'admin@crm.com', ?, 1),
      (2, 'Manager User', 'manager@crm.com', ?, 2),
      (3, 'Staff One', 'staff1@crm.com', ?, 3),
      (4, 'Staff Two', 'staff2@crm.com', ?, 3)
      ON DUPLICATE KEY UPDATE name=VALUES(name)`, [password, password, password, password]);

    // 3. Customers
    console.log('[seeder]: Seeding customers...');
    await pool.query(`INSERT INTO customers (id, name, email, phone, company, country, source, status_id, assigned_staff_id) VALUES 
      (1, 'Acme Corp', 'contact@acme.com', '1234567890', 'Acme Corp', 'USA', 'Website', 1, 3),
      (2, 'Global Tech', 'info@globaltech.com', '0987654321', 'Global Tech', 'UK', 'Referral', 2, 4),
      (3, 'StartUp Inc', 'hello@startup.com', '1112223333', 'StartUp Inc', 'Canada', 'Cold Call', 5, 3)
      ON DUPLICATE KEY UPDATE name=VALUES(name)`);

    // 4. Tasks
    console.log('[seeder]: Seeding tasks...');
    await pool.query(`INSERT INTO tasks (id, customer_id, assigned_staff_id, task_type, priority, status, notes, due_date) VALUES 
      (1, 1, 3, 'Call', 'High', 'Pending', 'Follow up on initial inquiry', '2026-05-01'),
      (2, 2, 4, 'Email', 'Medium', 'Completed', 'Send proposal draft', '2026-04-20'),
      (3, 3, 3, 'Meeting', 'Low', 'Pending', 'Onboarding meeting', '2026-05-10')
      ON DUPLICATE KEY UPDATE notes=VALUES(notes)`);

    // 5. Activities
    console.log('[seeder]: Seeding activities...');
    await pool.query(`INSERT INTO activities (id, customer_id, assigned_staff_id, activity_type, notes, activity_date) VALUES 
      (1, 1, 3, 'Call', 'Left a voicemail', '2026-04-24'),
      (2, 2, 4, 'Email', 'Sent pricing details', '2026-04-22')
      ON DUPLICATE KEY UPDATE notes=VALUES(notes)`);

    // 6. Assignments
    console.log('[seeder]: Seeding assignments...');
    await pool.query(`INSERT INTO assignments (id, customer_id, user_id, assigned_by, notes) VALUES 
      (1, 1, 3, 2, 'Assigned new lead from website'),
      (2, 2, 4, 1, 'Assigned referral to staff 2')
      ON DUPLICATE KEY UPDATE notes=VALUES(notes)`);

    console.log('[seeder]: Database seeded successfully!');
  } catch (error) {
    console.error('[seeder]: Error seeding database:', error);
  } finally {
    pool.end();
  }
}

seed();
