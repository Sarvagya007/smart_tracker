import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode]       = useState('login'); // 'login' | 'signup'
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
      const payload  = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const { data } = await api.post(endpoint, payload);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f1117 0%, #1a1d2e 100%)',
      padding: '1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: '#1e2235',
        border: '1px solid #2e3254',
        borderRadius: 20,
        padding: '2.5rem 2rem',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: 14,
            background: 'rgba(108,99,255,0.15)', marginBottom: '1rem',
          }}>
            <span style={{ fontSize: '1.6rem' }}>🎯</span>
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#e8eaf6', marginBottom: '0.25rem' }}>
            SmartPrep Tracker
          </h1>
          <p style={{ color: '#9da3c8', fontSize: '0.9rem' }}>
            {mode === 'login' ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Toggle */}
        <div style={{
          display: 'flex', background: '#252840', borderRadius: 10,
          padding: 4, marginBottom: '1.5rem',
        }}>
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              style={{
                flex: 1, padding: '0.5rem', border: 'none', borderRadius: 8,
                fontFamily: 'inherit', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                transition: 'all 0.2s',
                background: mode === m ? '#6c63ff' : 'transparent',
                color     : mode === m ? '#fff'    : '#9da3c8',
              }}
            >
              {m === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name" name="name" type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            className="btn btn-primary btn-full"
            style={{ marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
