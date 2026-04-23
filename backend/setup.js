/**
 * setup.js — One-time database initializer
 * Run: node setup.js
 *
 * This script:
 *  1. Creates the smart_tracker database (if it doesn't exist)
 *  2. Creates all tables (users, problems, submissions)
 *  3. Seeds ~22 sample problems for the recommendation engine
 *
 * Reads DATABASE_URL from your .env file.
 */

require('dotenv').config();
const { Client } = require('pg');

// ── Helper: run SQL against a specific database ───────────────────────────────
async function runSQL(connectionString, label, sql) {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    await client.query(sql);
    console.log(`✅ ${label}`);
  } finally {
    await client.end();
  }
}

async function main() {
  const dbUrl  = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL not found in .env — please create backend/.env first.');
    process.exit(1);
  }

  // Parse out the DB name and build a "postgres" (admin) URL for DB creation
  // e.g. postgresql://postgres:pass@localhost:5432/smart_tracker
  //   → postgresql://postgres:pass@localhost:5432/postgres
  const adminUrl = dbUrl.replace(/\/[^/]+$/, '/postgres');
  const dbName   = dbUrl.split('/').pop();

  console.log('\n🔧 Smart Job Prep Tracker — Database Setup\n');

  // Step 1: Skip database creation on managed services (like Render/RDS)
  // Most hosted DBs give you a connection string to a specific DB already.
  console.log(`📦 Preparing database schema...`);

  // Step 2: Create tables
  console.log('\n📋 Creating tables...');
  await runSQL(dbUrl, 'Tables created.', `
    CREATE TABLE IF NOT EXISTS users (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(100) NOT NULL,
      email      VARCHAR(150) UNIQUE NOT NULL,
      password   TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS problems (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(200) NOT NULL,
      topic      VARCHAR(100) NOT NULL,
      difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard'))
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id           SERIAL PRIMARY KEY,
      user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
      problem_id   INTEGER, -- ID from the problems.js file
      problem_name VARCHAR(200) NOT NULL,
      topic        VARCHAR(100) NOT NULL,
      difficulty   VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')),
      time_taken   INTEGER DEFAULT 0,
      status       VARCHAR(15) CHECK (status IN ('solved', 'attempted', 'not started')),
      notes        TEXT,
      revisit      BOOLEAN DEFAULT FALSE,
      date         TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, problem_name)
    );
  `);

  // Step 3: Seed problems (skip if already seeded)
  console.log('\n🌱 Seeding sample problems...');
  const seedClient = new Client({ connectionString: dbUrl });
  await seedClient.connect();
  try {
    const { rows } = await seedClient.query('SELECT COUNT(*) FROM problems');
    if (parseInt(rows[0].count) > 0) {
      console.log(`ℹ️  Problems already seeded (${rows[0].count} found) — skipping.`);
    } else {
      await seedClient.query(`
        INSERT INTO problems (name, topic, difficulty) VALUES
          ('Two Sum',                                          'Arrays',               'easy'),
          ('Best Time to Buy and Sell Stock',                 'Arrays',               'easy'),
          ('Maximum Subarray',                                'Arrays',               'medium'),
          ('Product of Array Except Self',                    'Arrays',               'medium'),
          ('Merge Intervals',                                 'Arrays',               'medium'),
          ('First Missing Positive',                          'Arrays',               'hard'),
          ('Valid Anagram',                                   'Strings',              'easy'),
          ('Longest Substring Without Repeating Characters', 'Strings',              'medium'),
          ('Group Anagrams',                                  'Strings',              'medium'),
          ('Minimum Window Substring',                        'Strings',              'hard'),
          ('Reverse Linked List',                             'Linked Lists',         'easy'),
          ('Merge Two Sorted Lists',                          'Linked Lists',         'easy'),
          ('Linked List Cycle II',                            'Linked Lists',         'medium'),
          ('Invert Binary Tree',                              'Trees',                'easy'),
          ('Binary Tree Level Order Traversal',               'Trees',                'medium'),
          ('Validate Binary Search Tree',                     'Trees',                'medium'),
          ('Binary Tree Maximum Path Sum',                    'Trees',                'hard'),
          ('Climbing Stairs',                                 'Dynamic Programming',  'easy'),
          ('Coin Change',                                     'Dynamic Programming',  'medium'),
          ('Longest Increasing Subsequence',                  'Dynamic Programming',  'medium'),
          ('Number of Islands',                               'Graphs',               'medium'),
          ('Course Schedule',                                 'Graphs',               'medium');
      `);
      console.log('✅ 22 problems seeded.');
    }
  } finally {
    await seedClient.end();
  }

  console.log('\n🎉 Setup complete! You can now run: npm run dev\n');
}

main().catch((err) => {
  console.error('\n❌ Setup failed:', err.message);
  console.error('\nMake sure your .env has the correct DATABASE_URL and PostgreSQL is running.\n');
  process.exit(1);
});
