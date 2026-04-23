import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const TOPICS = [
  'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs',
  'Dynamic Programming', 'Sorting', 'Binary Search', 'Hashing', 'Recursion',
];

const INITIAL = {
  problem_name: '',
  topic       : 'Arrays',
  difficulty  : 'medium',
  time_taken  : '',
  status      : 'solved',
};

export default function AddProblem() {
  const [form,    setForm]    = useState(INITIAL);
  const [msg,     setMsg]     = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });

    if (!form.problem_name.trim()) {
      return setMsg({ text: 'Problem name is required.', type: 'error' });
    }
    if (!form.time_taken || Number(form.time_taken) <= 0) {
      return setMsg({ text: 'Please enter a valid time taken (in minutes).', type: 'error' });
    }

    setLoading(true);
    try {
      await api.post('/submissions', {
        ...form,
        time_taken: Number(form.time_taken),
      });
      setMsg({ text: '✅ Problem submitted successfully!', type: 'success' });
      setForm(INITIAL);
      // Navigate to dashboard after a short delay
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Submission failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 600 }}>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e8eaf6' }}>
          Add Problem
        </h1>
        <p style={{ color: '#9da3c8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Log a coding problem you solved or attempted.
        </p>
      </div>

      <div className="card">
        {/* Feedback alert */}
        {msg.text && (
          <div className={`alert alert-${msg.type === 'error' ? 'error' : 'success'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Problem Name */}
          <div className="form-group">
            <label htmlFor="problem_name">Problem Name *</label>
            <input
              id="problem_name"
              name="problem_name"
              type="text"
              placeholder="e.g. Two Sum, Merge Intervals"
              value={form.problem_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Topic */}
          <div className="form-group">
            <label htmlFor="topic">Topic *</label>
            <select id="topic" name="topic" value={form.topic} onChange={handleChange}>
              {TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Difficulty + Status side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty *</label>
              <select id="difficulty" name="difficulty" value={form.difficulty} onChange={handleChange}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                <option value="solved">✅ Solved</option>
                <option value="failed">❌ Failed</option>
              </select>
            </div>
          </div>

          {/* Time Taken */}
          <div className="form-group">
            <label htmlFor="time_taken">Time Taken (minutes) *</label>
            <input
              id="time_taken"
              name="time_taken"
              type="number"
              min="1"
              placeholder="e.g. 25"
              value={form.time_taken}
              onChange={handleChange}
              required
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              id="submit-problem-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Submitting...' : 'Submit Problem'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Tip */}
      <div style={{
        marginTop: '1.25rem', padding: '0.9rem 1.1rem',
        background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)',
        borderRadius: 10, fontSize: '0.87rem', color: '#9da3c8',
      }}>
        💡 <strong style={{ color: '#e8eaf6' }}>Tip:</strong> Log every attempt — including failed ones.
        The tracker uses your failure rate to detect weak topics and recommend the right problems.
      </div>
    </div>
  );
}
