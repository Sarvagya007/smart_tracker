const pool = require('../config/db');

/**
 * POST /submissions
 * Adds a new problem submission for the authenticated user.
 */
const addSubmission = async (req, res) => {
  const { problem_id, problem_name, topic, difficulty, time_taken, status, notes, revisit } = req.body;
  const user_id = req.user.id;

  if (!problem_name || !topic || !difficulty || !status) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    // Upsert logic: If user+problem_id exists, update. Else, insert.
    // We use problem_name as a secondary unique identifier if problem_id is missing
    const query = `
      INSERT INTO submissions (user_id, problem_id, problem_name, topic, difficulty, time_taken, status, notes, revisit)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id, problem_name) 
      DO UPDATE SET 
        status = EXCLUDED.status,
        time_taken = EXCLUDED.time_taken,
        notes = EXCLUDED.notes,
        revisit = EXCLUDED.revisit,
        date = NOW()
      RETURNING *`;

    const result = await pool.query(query, [
      user_id, 
      problem_id || null, 
      problem_name, 
      topic, 
      difficulty, 
      time_taken || 0, 
      status.toLowerCase(), 
      notes || '', 
      revisit || false
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Add/Update submission error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * GET /submissions
 * Returns all submissions for the authenticated user, newest first.
 */
const getSubmissions = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM submissions WHERE user_id = $1 ORDER BY date DESC',
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get submissions error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { addSubmission, getSubmissions };
