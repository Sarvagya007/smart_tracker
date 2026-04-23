import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TrackerProvider } from './context/TrackerContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import TrackerPage from './pages/TrackerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import SolutionsPage from './pages/SolutionsPage';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/auth" replace />;
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TrackerProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            
            <Route path="/" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />

            <Route path="/tracker" element={
              <ProtectedRoute><TrackerPage /></ProtectedRoute>
            } />

            <Route path="/analytics" element={
              <ProtectedRoute><AnalyticsPage /></ProtectedRoute>
            } />

            <Route path="/recommendations" element={
              <ProtectedRoute><RecommendationsPage /></ProtectedRoute>
            } />

            <Route path="/solutions" element={
              <ProtectedRoute><SolutionsPage /></ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TrackerProvider>
    </AuthProvider>
  );
}
