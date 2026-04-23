import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

// Custom tooltip so it matches the dark theme
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#252840', border: '1px solid #2e3254',
      borderRadius: 8, padding: '0.6rem 0.9rem', fontSize: '0.85rem',
    }}>
      <div style={{ color: '#9da3c8', marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#6c63ff', fontWeight: 700 }}>
        {payload[0].value}% accuracy
      </div>
    </div>
  );
};

const COLORS = ['#6c63ff', '#7b73ff', '#8f88ff', '#a39dff', '#b8b4ff', '#ccc9ff'];

/**
 * TopicBarChart — Bar chart of accuracy % per topic.
 * Props:
 *   data  {Array<{ topic, accuracy }>}
 */
export default function TopicBarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#5c6388', padding: '2rem' }}>
        No topic data yet.
      </div>
    );
  }

  const chartData = data.map((d) => ({ name: d.topic, accuracy: d.accuracy }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2e3254" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#9da3c8', fontSize: 12 }}
          axisLine={{ stroke: '#2e3254' }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#9da3c8', fontSize: 12 }}
          axisLine={{ stroke: '#2e3254' }}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(108,99,255,0.08)' }} />
        <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
