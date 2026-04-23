import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTracker } from '../context/TrackerContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { streak } = useTracker();
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🚀</div>
        <div className="logo-text">DSA Tracker <span>Pro</span></div>
      </div>

      <div className="streak-pill">
        <span className="streak-num">🔥 {streak.count}</span>
        <span className="streak-label">Day Streak</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📊</span> Dashboard
        </NavLink>
        <NavLink to="/tracker" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🎯</span> Problem Tracker
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📈</span> Performance
        </NavLink>
        <NavLink to="/recommendations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">💡</span> Recommendations
        </NavLink>
        <NavLink to="/solutions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📝</span> Solutions
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="theme-toggle-row">
          <span>{theme === 'dark' ? '🌙 Dark' : '☀️ Light'} Mode</span>
          <button className="toggle" onClick={toggleTheme}></button>
        </div>
        <div style={{ marginTop: '1rem', padding: '0.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginBottom: '0.5rem' }}>👤 {user?.name}</div>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%' }} onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
