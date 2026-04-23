import React, { useState } from 'react';
import { useTracker } from '../context/TrackerContext';

export default function NoteModal({ problem, onClose }) {
  const { updateProgress, getProblemNotes } = useTracker();
  const [note, setNote] = useState(getProblemNotes(problem.id));

  const handleSave = () => {
    updateProgress(problem.id, { notes: note });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-hdr">
          <div className="modal-title">📝 Notes: {problem.name}</div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="form-grp">
          <label className="form-lbl">Key Approaches / Gotchas</label>
          <textarea 
            className="form-ta" 
            value={note} 
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Use binary search over the result range, beware of overflow..."
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save Note</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
