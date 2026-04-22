const mysql = require('mysql2/promise');

let pool = null;

// Initialize the database pool
async function initializePool() {
  try {
    // First, create a connection without specifying a database
    const initialConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'ambiance_photo_db';
    await initialConnection.execute(
      `CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✓ Database '${dbName}' created/verified`);

    // Close the initial connection
    await initialConnection.end();

    // Now create the pool with the database specified
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test the pool connection
    const connection = await pool.getConnection();
    console.log('✓ Connection pool created successfully');
    connection.release();

    return pool;
  } catch (err) {
    console.error('Failed to initialize database pool:', err.message);
    throw err;
  }
}

// Get the pool (initialize if needed)
function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initializePool() first.');
  }
  return pool;
}

module.exports = {
  initializePool,
  getPool,
  pool: new Proxy({}, {
    get(target, prop) {
      if (!pool) {
        throw new Error('Database pool not initialized');
      }
      return pool[prop];
    }
  })
};
