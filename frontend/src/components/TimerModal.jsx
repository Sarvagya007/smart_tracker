import React, { useState, useEffect } from 'react';
import { useTracker } from '../context/TrackerContext';

export default function TimerModal({ problem, onClose }) {
  const { updateProgress, getProblemTime } = useTracker();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    const prevTime = getProblemTime(problem.id);
    updateProgress(problem.id, { timeTaken: prevTime + Math.round(seconds / 60) });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-hdr">
          <div className="modal-title">⏱️ Solving: {problem.name}</div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="timer-dig">
          {formatTime(seconds)}
        </div>

        <div className="timer-controls">
          <button className="btn btn-primary" onClick={() => setIsActive(!isActive)}>
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button className="btn btn-ghost" onClick={() => setSeconds(0)}>Reset</button>
          <button className="btn btn-primary" onClick={handleSave}>Save & Close</button>
        </div>
      </div>
    </div>
  );
}
