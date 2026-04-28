const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function runMigrations() {
  console.log('[migrations]: Connecting to TiDB Cloud...');
  
  // 1. Connect without a specific database first to ensure the DB exists
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 4000,
    ssl: {
      rejectUnauthorized: false
    },
    multipleStatements: true 
  });

  try {
    const dbName = process.env.DB_NAME || 'minicrm';
    console.log(`[migrations]: Ensuring database "${dbName}" exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await connection.query(`USE ${dbName}`);

    const migrationsDir = path.join(__dirname, 'database', 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      if (file.endsWith('.sql')) {
        console.log(`[migrations]: Executing ${file}...`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        try {
          await connection.query(sql);
          console.log(`[migrations]: Successfully executed ${file}`);
        } catch (err) {
          if (err.code === 'ER_DUP_KEYNAME' || err.code === 'ER_DUP_FIELDNAME') {
            console.log(`[migrations]: Skipping ${file} (Index/Field already exists)`);
          } else {
            throw err;
          }
        }
      }
    }
    
    console.log('[migrations]: All migrations completed successfully!');
  } catch (error) {
    console.error('[migrations]: Error running migrations:', error);
  } finally {
    await connection.end();
  }
}

runMigrations();
