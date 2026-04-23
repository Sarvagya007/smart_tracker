# DSA Tracker Pro (Legacy: Smart Job Prep Tracker)

A premium full-stack platform to track, analyze, and master your DSA preparation with 200+ curated LeetCode problems.

**Stack:** React + Node.js/Express + PostgreSQL + localStorage (for tracker state)

---

## ✨ Premium Features

- **Problem Tracker:** 200+ real LeetCode problems with filtering and search.
- **Interactive Cards:** Difficulty badges, topic tags, and one-click status updates.
- **Built-in Timer:** Track your solving efficiency for every problem.
- **Approaches & Notes:** Save your logic and approaches directly on the problem cards.
- **Performance Analytics:** Real-time visualization of your topic mastery and accuracy.
- **Smart Recommendations:** Targeted goals based on your weak areas.
- **Streak Tracker:** Stay motivated with daily streaks.
- **Dark/Light Mode:** Clean, modern UI with full theme support.

---

## One-Time Setup

### 1. Edit your `.env` file

Open `backend/.env` and replace `YOUR_PASSWORD_HERE` with your PostgreSQL password:

```
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/smart_tracker
JWT_SECRET=smartprep_jwt_secret_2024
```

### 2. Run the setup script

```bash
cd backend
npm run setup
```

---

## Running the App

### Start the backend (port 5000)

```bash
cd backend
npm run dev
```

### Start the frontend (port 5173)

```bash
cd frontend
npm run dev
```

Then open: **http://localhost:5173**

---

## Analytics & Tracking Logic

### Accuracy
```
accuracy = (solved_count / total_attempts) * 100
```

### Weakness Score (per topic)
```
weakness_score = (100 - accuracy) + avg_time
```

### Streak Logic
Streaks are calculated based on consecutive days of marking at least one problem as "Solved".
