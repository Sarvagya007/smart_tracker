import React from 'react';

/**
 * StatCard — displays a single metric (label + value + optional sub-label).
 * Props:
 *   label    {string}  — e.g. "Total Solved"
 *   value    {string|number} — e.g. "42" or "78.5%"
 *   sub      {string}  — optional small subtitle
 *   color    {string}  — accent color for the top border strip
 */
export default function StatCard({ label, value, sub, color = '#6c63ff' }) {
  return (
    <div style={{
      background   : '#1e2235',
      border       : '1px solid #2e3254',
      borderRadius : 14,
      padding      : '1.4rem 1.5rem',
      borderTop    : `3px solid ${color}`,
      boxShadow    : '0 4px 20px rgba(0,0,0,0.3)',
      transition   : 'transform 0.18s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#9da3c8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: '#e8eaf6', lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '0.82rem', color: '#5c6388', marginTop: '0.4rem' }}>
          {sub}
        </div>
      )}
    </div>
  );
}
