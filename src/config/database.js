const mysql = require('mysql2/promise');
const logger = require('./logger');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shoes_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then((conn) => {
    logger.info('MySQL database connected successfully');
    conn.release();
  })
  .catch((err) => {
    logger.error(`MySQL connection failed: ${err.message}\n${err.stack || ''}`);
  });

module.exports = pool;
