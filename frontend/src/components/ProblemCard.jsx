import React, { useState } from 'react';
import { useTracker } from '../context/TrackerContext';

export default function ProblemCard({ problem, onOpenTimer, onOpenNote }) {
  const { getProblemStatus, updateProgress, getProblemNotes, getProblemRevisit } = useTracker();
  const status = getProblemStatus(problem.id);
  const notes = getProblemNotes(problem.id);
  const revisit = getProblemRevisit(problem.id);

  const statusClass = status.toLowerCase().replace(' ', '-');
  const diffClass = problem.difficulty.toLowerCase();

  const handleStatusToggle = () => {
    const nextStatus = status === 'Solved' ? 'Not Started' : status === 'Attempted' ? 'Solved' : 'Attempted';
    updateProgress(problem.id, { status: nextStatus });
  };

  const handleRevisitToggle = () => {
    updateProgress(problem.id, { revisit: !revisit });
  };

  return (
    <div className={`pc ${statusClass} ${revisit ? 'revisit' : ''}`}>
      <div className="pc-header">
        <span className="pc-num">#{problem.id}</span>
        <div className="pc-title">
          <a href={problem.link} target="_blank" rel="noopener noreferrer">
            {problem.name}
          </a>
        </div>
        <span className={`badge b-${diffClass}`}>{problem.difficulty}</span>
      </div>

      <div className="pc-meta">
        <span className="badge b-topic">{problem.topic}</span>
        <span className={`badge b-${statusClass}`}>{status}</span>
        {revisit && <span className="badge b-medium">🔁 Revisit</span>}
      </div>

      <div className="pc-actions">
        <button 
          className={`act-btn ${status === 'Solved' ? 'solve' : 'unsolved'}`}
          onClick={handleStatusToggle}
        >
          {status === 'Solved' ? '✅ Solved' : 'Mark Solved'}
        </button>
        <button 
          className={`act-btn ${notes ? 'note-has' : ''}`}
          onClick={() => onOpenNote(problem)}
        >
          {notes ? '📝 Note' : 'Add Note'}
        </button>
        <button className="act-btn timer" onClick={() => onOpenTimer(problem)}>
          ⏱️ Timer
        </button>
        <button className={`act-btn ${revisit ? 'note-has' : ''}`} onClick={handleRevisitToggle}>
          {revisit ? '🚩 Unflag' : '🚩 Revisit'}
        </button>
      </div>
    </div>
  );
}
