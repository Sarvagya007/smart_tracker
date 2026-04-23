/**
 * Analytics Helper Utilities
 * Pure functions used by both the analytics and recommendation controllers.
 * Keeping these separate makes testing and reuse straightforward.
 */

/**
 * Computes the weakness score for a topic.
 *
 * Formula: weakness_score = (100 - accuracy) + avg_time
 *   - A topic with 0% accuracy and 60 min avg time → score = 160 (very weak)
 *   - A topic with 90% accuracy and 10 min avg time → score = 20  (strong)
 *
 * Higher score = weaker topic = higher priority for improvement.
 *
 * @param {number} accuracy  - Percentage of problems solved (0–100)
 * @param {number} avgTime   - Average time taken in minutes
 * @returns {number} weakness score
 */
const computeWeaknessScore = (accuracy, avgTime) => {
  return (100 - accuracy) + avgTime;
};

/**
 * Maps topic accuracy to a recommended difficulty level.
 *
 * Logic:
 *   - accuracy < 50%       → recommend 'easy'   (user is struggling, build confidence)
 *   - 50% ≤ accuracy ≤ 80% → recommend 'medium' (user is improving)
 *   - accuracy > 80%       → recommend 'hard'   (user is strong, push further)
 *
 * @param {number} accuracy - Percentage of problems solved (0–100)
 * @returns {'easy'|'medium'|'hard'}
 */
const getDifficultyFromAccuracy = (accuracy) => {
  if (accuracy < 50) return 'easy';
  if (accuracy <= 80) return 'medium';
  return 'hard';
};

module.exports = { computeWeaknessScore, getDifficultyFromAccuracy };
