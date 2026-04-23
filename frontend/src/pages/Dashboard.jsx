import React from 'react';
import { useTracker } from '../context/TrackerContext';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, streak } = useTracker();

  const pieData = [
    { name: 'Solved', value: stats.solved, color: 'var(--accent)' },
    { name: 'Remaining', value: stats.total - stats.solved, color: 'var(--bg3)' }
  ];

  return (
    <div className="page fade-in">
      <header className="page-header">
        <h1 className="page-title">Welcome Back, <span>Warrior</span></h1>
        <p className="page-desc">You're on a <strong>{streak.count} day</strong> streak! Keep it up.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Solved</div>
          <div className="stat-value">{stats.solved}</div>
          <div className="stat-sub">Across all topics</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Completion</div>
          <div className="stat-value">{Math.round((stats.solved / stats.total) * 100) || 0}%</div>
          <div className="stat-sub">Target: 450 Problems</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Accuracy</div>
          <div className="stat-value">{stats.attempted > 0 ? Math.round((stats.solved / stats.attempted) * 100) : 0}%</div>
          <div className="stat-sub">Based on attempts</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Revisit Needed</div>
          <div className="stat-value">🔁 {stats.revisitCount}</div>
          <div className="stat-sub">Flagged for later review</div>
        </div>
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="card">
          <h2 className="sec-title">Completion Progress</h2>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  innerRadius={60} 
                  outerRadius={100} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="sec-title">Topic Mastery</h2>
          <div className="topic-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.topicStats.slice(0, 5).map(t => (
              <div key={t.topic} className="topic-row">
                <div className="topic-name">{t.topic}</div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width: `${t.percent}%`, background: 'var(--accent)' }}></div>
                </div>
                <div className="topic-pct">{t.percent}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="sec-title">Quick Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <span className="insight-icon">💡</span>
            <div className="insight-text">
              You've solved <strong>{stats.solved}</strong> problems in the last 7 days. Your most active topic is <strong>Arrays</strong>.
            </div>
          </div>
          <div className="insight-card" style={{ borderLeftColor: 'var(--warning)' }}>
            <span className="insight-icon">⚠️</span>
            <div className="insight-text">
              Your average time for <strong>Medium Strings</strong> problems is 42 mins, which is slightly above target.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
