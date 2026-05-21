require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function initDatabase() {
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    await connection.query(sql);
    console.log('Database initialized successfully with schema and seed data.');
  } finally {
    await connection.end();
  }
}

initDatabase().catch((err) => {
  console.error('Database initialization failed:', err.message);
  process.exit(1);
});
