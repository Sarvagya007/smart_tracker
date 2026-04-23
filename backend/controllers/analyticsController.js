const pool = require('../config/db');
const { computeWeaknessScore } = require('../utils/analyticsHelper');

/**
 * GET /analytics/overview
 *
 * Returns overall stats + per-topic breakdown for the logged-in user.
 *
 * Overall stats:
 *   total_attempts  = total rows in submissions for this user
 *   total_solved    = rows where status = 'solved'
 *   accuracy        = (total_solved / total_attempts) * 100
 *   avg_time        = AVG(time_taken) across all attempts
 *
 * Per topic:
 *   attempts, solved, accuracy, avg_time grouped by topic
 */
const getOverview = async (req, res) => {
  const user_id = req.user.id;

  try {
    // --- Overall stats using conditional aggregation ---
    const overallResult = await pool.query(
      `SELECT
         COUNT(*)                                                     AS total_attempts,
         COUNT(*) FILTER (WHERE status = 'solved')                   AS total_solved,
         ROUND(AVG(time_taken)::numeric, 2)                          AS avg_time,
         ROUND(
           COUNT(*) FILTER (WHERE status = 'solved') * 100.0
           / NULLIF(COUNT(*), 0), 2
         )                                                           AS accuracy
       FROM submissions
       WHERE user_id = $1`,
      [user_id]
    );

    // --- Per-topic breakdown ---
    const topicResult = await pool.query(
      `SELECT
         topic,
         COUNT(*)                                                     AS attempts,
         COUNT(*) FILTER (WHERE status = 'solved')                   AS solved,
         ROUND(AVG(time_taken)::numeric, 2)                          AS avg_time,
         ROUND(
           COUNT(*) FILTER (WHERE status = 'solved') * 100.0
           / NULLIF(COUNT(*), 0), 2
         )                                                           AS accuracy
       FROM submissions
       WHERE user_id = $1
       GROUP BY topic
       ORDER BY topic`,
      [user_id]
    );

    const o = overallResult.rows[0];

    res.json({
      total_attempts : parseInt(o.total_attempts)  || 0,
      total_solved   : parseInt(o.total_solved)    || 0,
      avg_time       : parseFloat(o.avg_time)      || 0,
      accuracy       : parseFloat(o.accuracy)      || 0,
      topics: topicResult.rows.map((r) => ({
        topic    : r.topic,
        attempts : parseInt(r.attempts),
        solved   : parseInt(r.solved),
        avg_time : parseFloat(r.avg_time),
        accuracy : parseFloat(r.accuracy),
      })),
    });
  } catch (err) {
    console.error('Get overview error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * GET /analytics/weak-topics
 *
 * Computes a weakness score per topic, returns the top 3 weakest.
 *
 * weakness_score = (100 - accuracy) + avg_time
 *   - A topic where the user often fails AND takes long → highest score
 *   - Sorted descending so the most urgent topics appear first
 */
const getWeakTopics = async (req, res) => {
  const user_id = req.user.id;

  try {
    const topicResult = await pool.query(
      `SELECT
         topic,
         ROUND(
           COUNT(*) FILTER (WHERE status = 'solved') * 100.0
           / NULLIF(COUNT(*), 0), 2
         ) AS accuracy,
         ROUND(AVG(time_taken)::numeric, 2) AS avg_time
       FROM submissions
       WHERE user_id = $1
       GROUP BY topic`,
      [user_id]
    );

    if (topicResult.rows.length === 0) {
      return res.json([]);
    }

    // Calculate weakness score in JS (keeps SQL simple)
    const scored = topicResult.rows.map((r) => {
      const accuracy = parseFloat(r.accuracy) || 0;
      const avgTime  = parseFloat(r.avg_time)  || 0;
      return {
        topic         : r.topic,
        accuracy,
        avg_time      : avgTime,
        weakness_score: computeWeaknessScore(accuracy, avgTime),
      };
    });

    // Sort by weakness_score DESC, return top 3
    const weakTopics = scored
      .sort((a, b) => b.weakness_score - a.weakness_score)
      .slice(0, 3);

    res.json(weakTopics);
  } catch (err) {
    console.error('Get weak topics error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getOverview, getWeakTopics };
