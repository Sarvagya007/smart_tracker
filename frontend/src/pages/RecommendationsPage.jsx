import React from 'react';
import { useTracker } from '../context/TrackerContext';
import { PROBLEMS } from '../data/problems';

export default function RecommendationsPage() {
  const { stats, getProblemStatus, progress } = useTracker();

  // Difficulty progression logic
  const diffStats = ['easy', 'medium', 'hard'].map(d => {
    const problems = PROBLEMS.filter(p => p.difficulty === d);
    const solved = problems.filter(p => progress[p.id]?.status === 'Solved').length;
    return { level: d, percent: Math.round((solved / problems.length) * 100) };
  });

  const nextTarget = diffStats.find(d => d.percent < 80) || diffStats[2];

  // Simple recommendation logic: find unsolved problems in weak topics
  const weakTopics = stats.topicStats
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 3)
    .map(t => t.topic);

  const recommendations = PROBLEMS.filter(p => 
    weakTopics.includes(p.topic) && getProblemStatus(p.id) === 'Not Started'
  ).slice(0, 6);

  return (
    <div className="page fade-in">
      <header className="page-header">
        <h1 className="page-title">Smart <span>Recommendations</span></h1>
        <p className="page-desc">Personalized goals to tackle your weak areas.</p>
      </header>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="sec-title">Difficulty Progression</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          {diffStats.map(d => (
            <div key={d.level} style={{ flex: 1 }}>
              <div className="flex justify-between" style={{ marginBottom: '0.4rem' }}>
                <span className="form-lbl" style={{ textTransform: 'capitalize' }}>{d.level}</span>
                <span className="topic-pct">{d.percent}%</span>
              </div>
              <div className="prog-track">
                <div className="prog-fill" style={{ width: `${d.percent}%`, background: `var(--${d.level})` }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="rec-why" style={{ marginTop: '1rem', borderLeft: '3px solid var(--accent)' }}>
          🚀 <strong>Next Focus:</strong> You should focus on <strong>{nextTarget.level.toUpperCase()}</strong> problems to reach 80% mastery.
        </div>
      </div>

      <div className="card" style={{ borderLeft: '4px solid var(--accent)', marginBottom: '2rem' }}>
        <h2 className="sec-title" style={{ color: 'var(--accent2)' }}>🎯 Today's Goal</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
          <div className="badge b-topic" style={{ padding: '0.5rem 1rem' }}>Solve 2 Linked Lists</div>
          <div className="badge b-topic" style={{ padding: '0.5rem 1rem' }}>Revise Binary Search</div>
        </div>
        <div className="rec-why" style={{ marginTop: '1rem' }}>
          <strong>Why this?</strong> Your accuracy in Linked Lists has dropped by 15% recently, and you haven't touched Binary Search in 4 days.
        </div>
      </div>

      <h2 className="sec-title">Recommended Problems</h2>
      <div className="rec-grid">
        {recommendations.map(p => (
          <div key={p.id} className="rec-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className={`badge b-${p.difficulty}`}>{p.difficulty}</span>
              <span className="badge b-topic">{p.topic}</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{p.name}</h3>
            <a 
              href={p.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
              style={{ marginTop: '1rem', width: '100%' }}
            >
              Solve Now
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
