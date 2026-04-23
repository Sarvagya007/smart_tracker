import React, { createContext, useContext, useState, useEffect } from 'react';
import { PROBLEMS } from '../data/problems';

const TrackerContext = createContext(null);

export const TrackerProvider = ({ children }) => {
  // progress: { [problemId]: { status, notes, timeTaken, dateSolved } }
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('dsa_progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('dsa_streak');
    return saved ? JSON.parse(saved) : { count: 0, lastDate: null };
  });

  const [loading, setLoading] = useState(true);

  // Sync with backend on mount/login
  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:5000/submissions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        const backendProgress = {};
        data.forEach(sub => {
          backendProgress[sub.problem_id || sub.problem_name] = {
            status: sub.status === 'solved' ? 'Solved' : sub.status === 'attempted' ? 'Attempted' : 'Not Started',
            notes: sub.notes,
            timeTaken: sub.time_taken,
            revisit: sub.revisit
          };
        });
        setProgress(prev => ({ ...prev, ...backendProgress }));
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  useEffect(() => {
    localStorage.setItem('dsa_progress', JSON.stringify(progress));
  }, [progress]);

  const updateProgress = async (problemId, updates) => {
    const problem = PROBLEMS.find(p => p.id === problemId);
    const newEntry = {
      ...(progress[problemId] || { status: 'Not Started', notes: '', timeTaken: 0, revisit: false }),
      ...updates
    };

    setProgress(prev => ({ ...prev, [problemId]: newEntry }));

    // Sync to backend if logged in
    const token = localStorage.getItem('token');
    if (token && problem) {
      try {
        await fetch('http://localhost:5000/submissions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({
            problem_id: problem.id,
            problem_name: problem.name,
            topic: problem.topic,
            difficulty: problem.difficulty,
            status: newEntry.status.toLowerCase(),
            time_taken: newEntry.timeTaken,
            notes: newEntry.notes,
            revisit: newEntry.revisit
          })
        });
      } catch (err) {
        console.error('Failed to sync progress:', err);
      }
    }

    // Auto-flag for revisit if time taken is too high
    if (updates.timeTaken > 45) {
      setProgress(prev => ({ 
        ...prev, 
        [problemId]: { ...prev[problemId], revisit: true } 
      }));
    }

    // Handle streak logic if problem is marked as solved
    if (updates.status === 'Solved' && progress[problemId]?.status !== 'Solved') {
      const today = new Date().toDateString();
      if (streak.lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = streak.lastDate === yesterday.toDateString();
        
        setStreak({
          count: isConsecutive ? streak.count + 1 : 1,
          lastDate: today
        });
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('dsa_streak', JSON.stringify(streak));
  }, [streak]);

  const getProblemStatus = (id) => progress[id]?.status || 'Not Started';
  const getProblemNotes = (id) => progress[id]?.notes || '';
  const getProblemTime = (id) => progress[id]?.timeTaken || 0;
  const getProblemRevisit = (id) => progress[id]?.revisit || false;

  const stats = {
    total: PROBLEMS.length,
    solved: Object.values(progress).filter(p => p.status === 'Solved').length,
    attempted: Object.values(progress).filter(p => p.status === 'Attempted').length,
    revisitCount: Object.values(progress).filter(p => p.revisit).length,
    topicStats: Array.from(new Set(PROBLEMS.map(p => p.topic))).map(topic => {
      const topicProblems = PROBLEMS.filter(p => p.topic === topic);
      const solvedInTopic = topicProblems.filter(p => progress[p.id]?.status === 'Solved').length;
      return {
        topic,
        total: topicProblems.length,
        solved: solvedInTopic,
        percent: Math.round((solvedInTopic / topicProblems.length) * 100)
      };
    })
  };

  return (
    <TrackerContext.Provider value={{
      progress,
      updateProgress,
      getProblemStatus,
      getProblemNotes,
      getProblemTime,
      getProblemRevisit,
      streak,
      stats
    }}>
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => useContext(TrackerContext);
