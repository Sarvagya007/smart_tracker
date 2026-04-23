const { Pool } = require('pg');
require('dotenv').config();

// Create a PostgreSQL connection pool.
// Pool reuses connections across requests — more efficient than creating a new connection each time.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection on startup so we know the DB is reachable
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to PostgreSQL:', err.stack);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release(); // Return the client to the pool
  }
});

module.exports = pool;
