-- ============================================================
-- Smart Job Prep Tracker — Database Schema
-- Run: psql -U postgres -d smart_tracker -f schema.sql
-- ============================================================

-- Users table: stores registered user accounts
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Problems table: pre-seeded pool of coding problems used by the recommendation engine
CREATE TABLE IF NOT EXISTS problems (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(200) NOT NULL,
  topic      VARCHAR(100) NOT NULL,
  difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

-- Submissions table: each row is one problem attempt by a user
-- user_id references users; cascades on delete so submissions are removed if user is deleted
CREATE TABLE IF NOT EXISTS submissions (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
  problem_name VARCHAR(200) NOT NULL,
  topic        VARCHAR(100) NOT NULL,
  difficulty   VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_taken   INTEGER NOT NULL,        -- time spent in minutes
  status       VARCHAR(10) CHECK (status IN ('solved', 'failed')),
  date         TIMESTAMP DEFAULT NOW()
);
