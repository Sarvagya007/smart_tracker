-- ============================================================
-- Smart Job Prep Tracker — Seed Data (~20 problems)
-- Run AFTER schema.sql:
--   psql -U postgres -d smart_tracker -f models/seed.sql
-- ============================================================

-- Clear existing problems before re-seeding (safe to re-run)
TRUNCATE TABLE problems RESTART IDENTITY CASCADE;

INSERT INTO problems (name, topic, difficulty) VALUES
  -- Arrays (6 problems)
  ('Two Sum',                        'Arrays', 'easy'),
  ('Best Time to Buy and Sell Stock','Arrays', 'easy'),
  ('Maximum Subarray',               'Arrays', 'medium'),
  ('Product of Array Except Self',   'Arrays', 'medium'),
  ('Merge Intervals',                'Arrays', 'medium'),
  ('First Missing Positive',         'Arrays', 'hard'),

  -- Strings (4 problems)
  ('Valid Anagram',                  'Strings', 'easy'),
  ('Longest Substring Without Repeating Characters', 'Strings', 'medium'),
  ('Minimum Window Substring',       'Strings', 'hard'),
  ('Group Anagrams',                 'Strings', 'medium'),

  -- Linked Lists (3 problems)
  ('Reverse Linked List',            'Linked Lists', 'easy'),
  ('Merge Two Sorted Lists',         'Linked Lists', 'easy'),
  ('Linked List Cycle II',           'Linked Lists', 'medium'),

  -- Trees (4 problems)
  ('Invert Binary Tree',             'Trees', 'easy'),
  ('Binary Tree Level Order Traversal','Trees', 'medium'),
  ('Validate Binary Search Tree',    'Trees', 'medium'),
  ('Binary Tree Maximum Path Sum',   'Trees', 'hard'),

  -- Dynamic Programming (3 problems)
  ('Climbing Stairs',                'Dynamic Programming', 'easy'),
  ('Coin Change',                    'Dynamic Programming', 'medium'),
  ('Longest Increasing Subsequence', 'Dynamic Programming', 'medium'),

  -- Graphs (2 problems)
  ('Number of Islands',              'Graphs', 'medium'),
  ('Course Schedule',                'Graphs', 'medium');
