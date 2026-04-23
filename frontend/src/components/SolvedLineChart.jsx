import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Dot,
} from 'recharts';

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#252840', border: '1px solid #2e3254',
      borderRadius: 8, padding: '0.6rem 0.9rem', fontSize: '0.85rem',
    }}>
      <div style={{ color: '#9da3c8', marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#22c55e', fontWeight: 700 }}>
        {payload[0].value} solved
      </div>
    </div>
  );
};

/**
 * SolvedLineChart — Line chart of problems solved per day.
 *
 * Receives raw submissions array, groups them by date (YYYY-MM-DD),
 * counts only status='solved' per day, then renders the trend.
 *
 * Props:
 *   submissions {Array<{ date, status }>}
 */
export default function SolvedLineChart({ submissions }) {
  if (!submissions || submissions.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#5c6388', padding: '2rem' }}>
        No submission data yet.
      </div>
    );
  }

  // Group solved count by date
  const byDate = {};
  submissions.forEach(({ date, status }) => {
    const day = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short',
    });
    if (!byDate[day]) byDate[day] = 0;
    if (status === 'solved') byDate[day] += 1;
  });

  // Convert to array sorted chronologically (oldest first)
  const chartData = Object.entries(byDate)
    .map(([date, solved]) => ({ date, solved }))
    .reverse(); // submissions come in DESC from API → reverse for left-to-right timeline

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2e3254" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#9da3c8', fontSize: 12 }}
          axisLine={{ stroke: '#2e3254' }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: '#9da3c8', fontSize: 12 }}
          axisLine={{ stroke: '#2e3254' }}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="solved"
          stroke="#22c55e"
          strokeWidth={2.5}
          dot={<Dot r={4} fill="#22c55e" stroke="#0f1117" strokeWidth={2} />}
          activeDot={{ r: 6, fill: '#22c55e' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
