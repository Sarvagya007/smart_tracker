import React from 'react';
import { useTracker } from '../context/TrackerContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PROBLEMS } from '../data/problems';

export default function AnalyticsPage() {
  const { stats, progress, streak } = useTracker();

  const data = stats.topicStats.map(t => ({
    name: t.topic,
    Solved: t.solved,
    Total: t.total
  }));

  // Real efficiency metrics
  const getAvgTime = (diff) => {
    const solvedWithTime = Object.entries(progress)
      .filter(([id, p]) => {
        const prob = PROBLEMS.find(pr => pr.id === parseInt(id));
        return prob?.difficulty === diff && p.status === 'Solved' && p.timeTaken > 0;
      })
      .map(([id, p]) => p.timeTaken);
    
    if (solvedWithTime.length === 0) return 0;
    return Math.round(solvedWithTime.reduce((a, b) => a + b, 0) / solvedWithTime.length);
  };

  const avgEasy = getAvgTime('easy');
  const avgMed = getAvgTime('medium');

  const consistency = Math.min(100, stats.solved * 2 + streak.count * 5);

  return (
    <div className="page fade-in">
      <header className="page-header">
        <h1 className="page-title">Performance <span>Analytics</span></h1>
        <p className="page-desc">Deep dive into your strengths and weaknesses.</p>
      </header>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 className="sec-title">Solved Count by Topic</h2>
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--text2)" />
              <YAxis stroke="var(--text2)" />
              <Tooltip 
                contentStyle={{ background: 'var(--bg2)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
              <Bar dataKey="Solved" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h2 className="sec-title">Efficiency Metrics</h2>
          <div className="stat-item" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-label">Avg. Solving Time (Easy)</div>
            <div className="stat-value">{avgEasy ? `${avgEasy} mins` : 'N/A'}</div>
            <div className="stat-sub" style={{ color: avgEasy < 20 ? 'var(--success)' : 'var(--warning)' }}>
              {avgEasy ? (avgEasy < 20 ? '⚡ Efficient' : '🐢 Needs work') : 'Solve more to see stats'}
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Avg. Solving Time (Medium)</div>
            <div className="stat-value">{avgMed ? `${avgMed} mins` : 'N/A'}</div>
            <div className="stat-sub" style={{ color: avgMed < 40 ? 'var(--success)' : 'var(--warning)' }}>
              {avgMed ? (avgMed < 40 ? '⚡ Efficient' : '🐢 Slightly Slow') : 'Solve more to see stats'}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="sec-title">Consistency Score</h2>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--accent)' }}>{consistency}</div>
            <div className="stat-sub">Based on daily activity & streaks</div>
          </div>
        </div>
      </div>
    </div>
  );
}
