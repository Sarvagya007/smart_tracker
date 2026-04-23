import React, { useState, useMemo } from 'react';
import { PROBLEMS } from '../data/problems';
import ProblemCard from '../components/ProblemCard';
import TimerModal from '../components/TimerModal';
import NoteModal from '../components/NoteModal';
import { useTracker } from '../context/TrackerContext';

export default function TrackerPage() {
  const { stats, getProblemStatus, getProblemRevisit, progress } = useTracker();
  const [search, setSearch] = useState('');
  const [filterTopic, setFilterTopic] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const [activeTimer, setActiveTimer] = useState(null);
  const [activeNote, setActiveNote] = useState(null);

  const topics = ['All', ...new Set(PROBLEMS.map(p => p.topic))];

  const filteredProblems = useMemo(() => {
    return PROBLEMS.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchTopic = filterTopic === 'All' || p.topic === filterTopic;
      const matchDiff = filterDiff === 'All' || p.difficulty === filterDiff.toLowerCase();
      const matchStatus = filterStatus === 'All' 
        ? true 
        : filterStatus === 'Revisit' 
          ? getProblemRevisit(p.id) 
          : getProblemStatus(p.id) === filterStatus;
      return matchSearch && matchTopic && matchDiff && matchStatus;
    });
  }, [search, filterTopic, filterDiff, filterStatus, progress]);

  return (
    <div className="page fade-in">
      <header className="page-header">
        <h1 className="page-title">Problem <span>Tracker</span></h1>
        <p className="page-desc">Track your progress through 200+ curated LeetCode problems.</p>
      </header>

      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-ico">🔍</span>
          <input 
            type="text" 
            placeholder="Search problems..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="flt-select" value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)}>
          {topics.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select className="flt-select" value={filterDiff} onChange={(e) => setFilterDiff(e.target.value)}>
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select className="flt-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Not Started">Not Started</option>
          <option value="Attempted">Attempted</option>
          <option value="Solved">Solved</option>
          <option value="Revisit">Revisit Needed</option>
        </select>
      </div>

      <div className="problems-list">
        {filteredProblems.map(p => (
          <ProblemCard 
            key={p.id} 
            problem={p} 
            onOpenTimer={setActiveTimer}
            onOpenNote={setActiveNote}
          />
        ))}
      </div>

      {activeTimer && <TimerModal problem={activeTimer} onClose={() => setActiveTimer(null)} />}
      {activeNote && <NoteModal problem={activeNote} onClose={() => setActiveNote(null)} />}
    </div>
  );
}
