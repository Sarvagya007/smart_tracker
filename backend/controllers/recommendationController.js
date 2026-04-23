const pool = require('../config/db');
const { computeWeaknessScore, getDifficultyFromAccuracy } = require('../utils/analyticsHelper');

/**
 * GET /recommendations
 *
 * Recommendation Engine — 3 steps:
 *
 * Step 1: Compute per-topic accuracy and avg_time from the user's submissions.
 * Step 2: Score each topic using weakness_score = (100 - accuracy) + avg_time,
 *         then take the top 3 weakest topics.
 * Step 3: For each weak topic, choose a difficulty level based on accuracy bracket,
 *         then fetch up to 2 matching problems from the problems table.
 *
 * Difficulty mapping:
 *   accuracy < 50%       → easy   (rebuild fundamentals)
 *   50% ≤ accuracy ≤ 80% → medium (solidify understanding)
 *   accuracy > 80%       → hard   (push limits)
 */
const getRecommendations = async (req, res) => {
  const user_id = req.user.id;

  try {
    // Step 1: Get per-topic stats for this user
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
      return res.json({
        message: 'No submissions yet. Add some problems to get recommendations!',
        recommendations: [],
      });
    }

    // Step 2: Rank topics by weakness score, take top 3
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

    const weakTopics = scored
      .sort((a, b) => b.weakness_score - a.weakness_score)
      .slice(0, 3);

    // Step 3: For each weak topic, fetch problems at the appropriate difficulty
    const recommendations = [];

    for (const wt of weakTopics) {
      const difficulty = getDifficultyFromAccuracy(wt.accuracy);

      const problemsResult = await pool.query(
        `SELECT id, name, topic, difficulty
         FROM problems
         WHERE topic = $1 AND difficulty = $2
         LIMIT 2`,
        [wt.topic, difficulty]
      );

      recommendations.push({
        topic                 : wt.topic,
        accuracy              : wt.accuracy,
        weakness_score        : wt.weakness_score,
        recommended_difficulty: difficulty,
        problems              : problemsResult.rows,
      });
    }

    res.json(recommendations);
  } catch (err) {
    console.error('Get recommendations error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getRecommendations };
