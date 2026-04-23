import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DIFF_COLOR = {
  easy  : { bg: 'rgba(34,197,94,0.12)',  color: '#22c55e' },
  medium: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  hard  : { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444' },
};

export default function Recommendations() {
  const [recs,    setRecs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const { data } = await api.get('/recommendations');
        // API returns either an object with {message, recommendations:[]} or a plain array
        if (Array.isArray(data)) {
          setRecs(data);
        } else {
          setMessage(data.message || '');
          setRecs(data.recommendations || []);
        }
      } catch (err) {
        setError('Failed to load recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  if (loading) return (
    <div className="spinner-wrap"><div className="spinner" /></div>
  );

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e8eaf6' }}>
          Recommendations
        </h1>
        <p style={{ color: '#9da3c8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Problems picked from your weakest topics, at the right difficulty level.
        </p>
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Empty state */}
      {!error && recs.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤔</div>
          <h2 style={{ color: '#e8eaf6', marginBottom: '0.5rem' }}>
            {message || 'No recommendations yet'}
          </h2>
          <p style={{ color: '#9da3c8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Submit some problems first so we can analyse your weak topics.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/add')}
          >
            Add Your First Problem
          </button>
        </div>
      )}

      {/* Recommendation cards */}
      {recs.map((rec) => {
        const diff = rec.recommended_difficulty;
        const dc   = DIFF_COLOR[diff] || DIFF_COLOR.medium;

        return (
          <div key={rec.topic} className="card" style={{ marginBottom: '1.25rem' }}>
            {/* Topic header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e8eaf6' }}>
                  {rec.topic}
                </h2>
                <p style={{ color: '#9da3c8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  Accuracy: <strong style={{ color: '#e8eaf6' }}>{rec.accuracy}%</strong>
                  &nbsp;·&nbsp;
                  Weakness score: <strong style={{ color: '#f59e0b' }}>{rec.weakness_score?.toFixed(1)}</strong>
                </p>
              </div>

              {/* Recommended difficulty badge */}
              <div style={{
                padding: '0.3rem 0.85rem', borderRadius: 999,
                background: dc.bg, color: dc.color,
                fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.06em', whiteSpace: 'nowrap',
              }}>
                {diff} recommended
              </div>
            </div>

            {/* Why this difficulty — explanation */}
            <div style={{
              padding: '0.7rem 0.9rem', borderRadius: 8,
              background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.15)',
              fontSize: '0.85rem', color: '#9da3c8', marginBottom: '1rem',
            }}>
              💡&nbsp;
              {rec.accuracy < 50
                ? `Accuracy is below 50% — start with easy problems to build a solid foundation.`
                : rec.accuracy <= 80
                ? `Accuracy is between 50–80% — medium problems will help you solidify this topic.`
                : `Accuracy is above 80% — challenge yourself with hard problems to reach mastery.`
              }
            </div>

            {/* Problem list */}
            {rec.problems.length === 0 ? (
              <p className="text-muted">No problems found for this topic & difficulty in the database.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {rec.problems.map((p) => (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#252840', borderRadius: 10,
                    padding: '0.8rem 1rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ color: '#6c63ff', fontSize: '1rem' }}>📝</span>
                      <span style={{ fontWeight: 500, color: '#e8eaf6' }}>{p.name}</span>
                    </div>
                    <span className={`badge badge-${p.difficulty}`}>{p.difficulty}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
