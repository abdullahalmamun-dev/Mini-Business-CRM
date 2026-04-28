const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function runMigrations() {
  console.log('[migrations]: Connecting to database...');
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mini_crm',
    port: process.env.DB_PORT || 3306,
    ssl: {
      rejectUnauthorized: false
    },
    multipleStatements: true 
  });

  try {
    const migrationsDir = path.join(__dirname, 'database', 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      if (file.endsWith('.sql')) {
        console.log(`[migrations]: Executing ${file}...`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        await pool.query(sql);
        console.log(`[migrations]: Successfully executed ${file}`);
      }
    }
    
    console.log('[migrations]: All migrations completed successfully!');
  } catch (error) {
    console.error('[migrations]: Error running migrations:', error);
  } finally {
    pool.end();
  }
}

runMigrations();
