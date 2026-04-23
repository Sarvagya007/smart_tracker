import React, { useState } from 'react';
import { useTracker } from '../context/TrackerContext';
import { PROBLEMS } from '../data/problems';

export default function SolutionsPage() {
  const { progress } = useTracker();
  const [search, setSearch] = useState('');
  const [explanation, setExplanation] = useState(null);

  const solvedProblems = PROBLEMS.filter(p => progress[p.id]?.notes);

  const generateExplanation = (p) => {
    const topicRules = {
      'Arrays': [
        "1. Consider if the array is sorted; if so, Binary Search or Two Pointers is likely.",
        "2. Use a HashMap to store frequencies or indices for O(1) lookups.",
        "3. For subarray problems, check if a Sliding Window or Prefix Sum approach applies.",
        "4. In-place manipulation can often save O(n) space complexity."
      ],
      'Dynamic Programming': [
        "1. Identify the 'State': What parameters uniquely define a subproblem?",
        "2. Formulate the 'Transition': How does the result of a larger problem relate to smaller ones?",
        "3. Choose between Top-Down (Memoization) or Bottom-Up (Tabulation).",
        "4. Optimization: Can we reduce space from O(n^2) to O(n) by only keeping the previous row?"
      ],
      'Trees': [
        "1. Recursive DFS is the most common for depth/path problems.",
        "2. Use BFS (Level Order) for shortest distance or 'closest' nodes in unweighted graphs.",
        "3. For BSTs, remember the In-order traversal gives a sorted sequence.",
        "4. Consider the 'Lowest Common Ancestor' pattern for hierarchical relationship queries."
      ],
      'Linked Lists': [
        "1. Use a Dummy Head to handle edge cases (like removing the first node) easily.",
        "2. Fast & Slow pointers are perfect for cycle detection or finding the middle.",
        "3. When reversing, keep track of 'Prev', 'Curr', and 'Next' pointers carefully.",
        "4. Many list problems can be solved by converting to an array if space allows."
      ],
      'Graphs': [
        "1. BFS is better for shortest path in unweighted graphs.",
        "2. DFS is better for connectivity, cycle detection, or topological sorting.",
        "3. Use Dijkstra's for shortest path in weighted graphs with non-negative edges.",
        "4. Union-Find (Disjoint Set) is powerful for dynamic connectivity and Kruskal's algorithm."
      ]
    };
    
    const steps = topicRules[p.topic] || [
      "1. Analyze the time/space constraints to determine the target complexity.",
      "2. Dry run with small edge cases (empty input, single element).",
      "3. Look for repeated work that can be optimized using a data structure."
    ];

    setExplanation({
      id: p.id,
      steps: steps
    });
  };

  const filtered = solvedProblems.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page fade-in">
      <header className="page-header">
        <h1 className="page-title">Solution <span>Review</span></h1>
        <p className="page-desc">Review your approaches and notes for solved problems.</p>
      </header>

      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-ico">🔍</span>
          <input 
            type="text" 
            placeholder="Search your notes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="solutions-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <p>No solutions with notes found. Add notes to your solved problems in the tracker!</p>
          </div>
        ) : (
          filtered.map(p => (
            <div key={p.id} className="sol-card">
              <div className="sol-hdr">
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{p.name}</h3>
                  <span className="text-muted">#{p.id} · {p.topic}</span>
                </div>
                <span className={`badge b-${p.difficulty}`}>{p.difficulty}</span>
              </div>
              <div className="sol-body">
                <div className="sec-title" style={{ fontSize: '0.9rem' }}>Approach / Notes:</div>
                <div className="code-block">
                  {progress[p.id].notes}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button className="upvote-btn">👍 12 Upvotes</button>
                  <button className="btn btn-ghost btn-sm">💬 Comment</button>
                  <button 
                    className="btn btn-primary btn-sm" 
                    style={{ marginLeft: 'auto' }}
                    onClick={() => generateExplanation(p)}
                  >
                    🤖 Explain Approach
                  </button>
                </div>
                {explanation?.id === p.id && (
                  <div className="rec-why" style={{ marginTop: '1rem', background: 'var(--bg3)', border: '1px solid var(--accent)' }}>
                    <div style={{ marginBottom: '0.5rem', fontWeight: 800 }}>🤖 AI Solving Strategy:</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {explanation.steps.map((s, idx) => (
                        <li key={idx} style={{ marginBottom: '0.3rem', fontSize: '0.9rem' }}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
