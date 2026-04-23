const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize DB connection (logs success/failure on startup)
require('./config/db');

// Import route handlers
const authRoutes           = require('./routes/authRoutes');
const submissionRoutes     = require('./routes/submissionRoutes');
const analyticsRoutes      = require('./routes/analyticsRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
// Allow requests from the Vite dev server
// Allow requests from the frontend (Vercel URL in production, localhost in dev)
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true 
}));

// Parse JSON request bodies
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/auth',            authRoutes);
app.use('/submissions',     submissionRoutes);
app.use('/analytics',       analyticsRoutes);
app.use('/recommendations', recommendationRoutes);

// Health check
app.get('/', (_req, res) => {
  res.json({ message: '✅ Smart Job Prep Tracker API is running.' });
});

// ── 404 handler ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// ── Start server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
