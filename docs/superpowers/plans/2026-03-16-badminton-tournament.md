# Badminton Tournament Manager Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first badminton tournament web application with intelligent round-robin scheduling and real-time leaderboard

**Architecture:** Pure client-side vanilla JavaScript application with High-Fidelity Claymorphism design system

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript ES6+, Google Fonts (Nunito + DM Sans)

---

## Chunk 1: Foundation & Design System

### Task 1: Project Structure & HTML Foundation

**Files:**
- Create: `index.html`
- Create: `css/design-system.css`
- Create: `css/components.css`
- Create: `css/animations.css`

- [ ] **Step 1: Create index.html with semantic structure**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Mobile-friendly badminton tournament manager with intelligent round-robin scheduling">
  <title>Badminton Tournament Manager</title>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="css/design-system.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/animations.css">
</head>
<body>
  <!-- Background Blobs -->
  <div class="blobs-container">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
  </div>

  <!-- Main Container -->
  <div class="container">
    <!-- Hero Header -->
    <header class="hero">
      <h1 class="hero-title">Badminton Tournament</h1>
      <p class="hero-subtitle">Smart doubles scheduling for your games</p>
    </header>

    <!-- Player Management (Pre-Tournament) -->
    <section id="playerManagement" class="section">
      <!-- Content added in later tasks -->
    </section>

    <!-- Court Display (Tournament Active) -->
    <section id="courtDisplay" class="section hidden">
      <!-- Content added in later tasks -->
    </section>

    <!-- Match Queue -->
    <section id="matchQueue" class="section hidden">
      <!-- Content added in later tasks -->
    </section>

    <!-- Leaderboard Modal -->
    <div id="leaderboardModal" class="modal hidden">
      <!-- Content added in later tasks -->
    </div>

    <!-- Settings Menu -->
    <div id="settingsMenu" class="menu hidden">
      <!-- Content added in later tasks -->
    </div>
  </div>

  <!-- JavaScript Modules -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify HTML structure**

Open `index.html` in browser
Expected: Blank page with proper fonts loaded (check DevTools Network tab)

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add HTML foundation with semantic structure"
```

### Task 2: Design System - CSS Custom Properties

**Files:**
- Modify: `css/design-system.css`

- [ ] **Step 1: Add CSS custom properties for colors, typography, and shadows**

```css
/* css/design-system.css */

/* ===========================
   High-Fidelity Claymorphism Design System
   Mobile-First Badminton Tournament
   =========================== */

:root {
  /* Colors - Sporty Palette */
  --clay-canvas: #F4F1FA;
  --clay-foreground: #332F3A;
  --clay-muted: #635F69;
  
  --clay-emerald: #10B981;
  --clay-emerald-light: #6EE7B7;
  --clay-violet: #7C3AED;
  --clay-violet-light: #A78BFA;
  --clay-sky: #0EA5E9;
  --clay-amber: #F59E0B;
  --clay-pink: #DB2777;
  
  /* Typography */
  --font-heading: 'Nunito', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  
  /* Spacing (Mobile-First) */
  --spacing-xs: 0.5rem;    /* 8px */
  --spacing-sm: 0.75rem;   /* 12px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  
  /* Border Radii (Mobile) */
  --radius-sm: 0.75rem;    /* 12px */
  --radius-md: 1rem;       /* 16px */
  --radius-lg: 1.25rem;    /* 20px */
  --radius-xl: 1.5rem;     /* 24px */
  --radius-2xl: 2rem;      /* 32px */
  
  /* Shadows - 4-Layer Stacks */
  --shadow-clay-card: 
    12px 12px 24px rgba(160, 150, 180, 0.15),
    -8px -8px 20px rgba(255, 255, 255, 0.9),
    inset 4px 4px 10px rgba(139, 92, 246, 0.03),
    inset -4px -4px 10px rgba(255, 255, 255, 1);
  
  --shadow-clay-button: 
    10px 10px 20px rgba(139, 92, 246, 0.25),
    -6px -6px 14px rgba(255, 255, 255, 0.4),
    inset 3px 3px 6px rgba(255, 255, 255, 0.4),
    inset -3px -3px 6px rgba(0, 0, 0, 0.1);
  
  --shadow-clay-button-hover: 
    14px 14px 28px rgba(139, 92, 246, 0.3),
    -8px -8px 18px rgba(255, 255, 255, 0.5),
    inset 4px 4px 8px rgba(255, 255, 255, 0.5),
    inset -4px -4px 8px rgba(0, 0, 0, 0.12);
  
  --shadow-clay-pressed: 
    inset 8px 8px 16px #d9d4e3,
    inset -8px -8px 16px #ffffff;
  
  /* Transitions */
  --transition-fast: 200ms ease-out;
  --transition-base: 300ms ease-out;
  --transition-slow: 500ms ease-out;
}

/* Tablet Adjustments */
@media (min-width: 768px) {
  :root {
    --spacing-xl: 2.5rem;
    --spacing-2xl: 4rem;
    --radius-xl: 2rem;
    --radius-2xl: 2.5rem;
  }
}

/* Desktop Adjustments */
@media (min-width: 1024px) {
  :root {
    --spacing-2xl: 5rem;
    --radius-2xl: 3rem;
  }
}

/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  font-weight: 500;
  line-height: 1.625;
  color: var(--clay-foreground);
  background-color: var(--clay-canvas);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 900;
  line-height: 1.1;
}

.hidden {
  display: none !important;
}

.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--spacing-md);
}

@media (min-width: 768px) {
  .container {
    padding: var(--spacing-lg);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-xl);
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify CSS loads correctly**

Open `index.html` in browser
Expected: Background color changes to `#F4F1FA` (pale lavender)

- [ ] **Step 3: Commit**

```bash
git add css/design-system.css
git commit -m "feat: add design system CSS custom properties"
```

### Task 3: Background Blobs & Animations

**Files:**
- Modify: `css/animations.css`
- Modify: `css/components.css`

- [ ] **Step 1: Create blob animations**

```css
/* css/animations.css */

@keyframes clay-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

@keyframes clay-float-delayed {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-2deg); }
}

@keyframes clay-float-slow {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(5deg); }
}

@keyframes clay-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.animate-float { animation: clay-float 8s ease-in-out infinite; }
.animate-float-delayed { animation: clay-float-delayed 10s ease-in-out infinite; }
.animate-breathe { animation: clay-breathe 6s ease-in-out infinite; }
.animate-slide-up { animation: slide-up 500ms ease-out forwards; }
.animate-fade-in { animation: fade-in 300ms ease-out forwards; }
.animate-shake { animation: shake 300ms ease-out; }
```

- [ ] **Step 2: Style background blobs**

```css
/* css/components.css */

.blobs-container {
  pointer-events: none;
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: -1;
}

.blob {
  position: absolute;
  width: 60vh;
  height: 60vh;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.1;
}

.blob-1 {
  background-color: var(--clay-emerald);
  top: -10%;
  left: -10%;
  animation: clay-float 8s ease-in-out infinite;
}

.blob-2 {
  background-color: var(--clay-violet);
  top: 20%;
  right: -10%;
  animation: clay-float-delayed 10s ease-in-out infinite;
}

@media (min-width: 768px) {
  .blobs-container::after {
    content: '';
    position: absolute;
    width: 50vh;
    height: 50vh;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.1;
    background-color: var(--clay-sky);
    bottom: -10%;
    left: 30%;
    animation: clay-float-slow 12s ease-in-out infinite;
  }
}
```

- [ ] **Step 3: Verify blobs animate**

Open `index.html` in browser
Expected: See subtle animated colored blobs in background

- [ ] **Step 4: Commit**

```bash
git add css/animations.css css/components.css
git commit -m "feat: add background blobs with clay animations"
```

### Task 4: Hero Header & Button Components

**Files:**
- Modify: `css/components.css`

- [ ] **Step 1: Add hero and button styles**

```css
/* Append to css/components.css */

/* Hero Header */
.hero {
  text-align: center;
  padding: var(--spacing-xl) 0;
  position: relative;
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 900;
  letter-spacing: -0.025em;
  margin-bottom: var(--spacing-sm);
  background: linear-gradient(135deg, var(--clay-foreground) 20%, var(--clay-emerald) 60%, var(--clay-violet) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 0.875rem;
  color: var(--clay-muted);
  font-weight: 500;
}

@media (min-width: 768px) {
  .hero-title { font-size: 3rem; }
  .hero-subtitle { font-size: 1rem; }
}

@media (min-width: 1024px) {
  .hero-title { font-size: 3.75rem; }
  .hero-subtitle { font-size: 1.125rem; }
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-weight: 700;
  letter-spacing: 0.05em;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.btn-md {
  height: 3.5rem;
  padding: 0 var(--spacing-xl);
  font-size: 1rem;
  border-radius: var(--radius-lg);
}

.btn-lg {
  height: 4rem;
  padding: 0 var(--spacing-2xl);
  font-size: 1.125rem;
  border-radius: var(--radius-lg);
}

.btn-primary {
  background: linear-gradient(135deg, var(--clay-emerald-light), var(--clay-emerald));
  color: white;
  box-shadow: var(--shadow-clay-button);
}

.btn-primary:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-clay-button-hover);
}

.btn-primary:active {
  transform: scale(0.92);
  box-shadow: var(--shadow-clay-pressed);
}

.btn-secondary {
  background: linear-gradient(135deg, var(--clay-violet-light), var(--clay-violet));
  color: white;
  box-shadow: var(--shadow-clay-button);
}

.btn-secondary:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-clay-button-hover);
}

.btn-secondary:active {
  transform: scale(0.92);
  box-shadow: var(--shadow-clay-pressed);
}

.btn-full {
  width: 100%;
}

@media (min-width: 640px) {
  .btn-full { width: auto; }
}
```

- [ ] **Step 2: Verify styles**

Open `index.html` in browser
Expected: Hero title has gradient, background is lavender

- [ ] **Step 3: Commit**

```bash
git add css/components.css
git commit -m "feat: add hero header and button components"
```

---

## Chunk 2: Player Management UI

### Task 5: Player Management HTML Structure

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add player management section HTML**

Replace the `<!-- Player Management (Pre-Tournament) -->` section with:

```html
<!-- Player Management (Pre-Tournament) -->
<section id="playerManagement" class="section">
  <div class="card">
    <h2 class="section-title">Add Players</h2>
    <p class="section-subtitle">Minimum 4 players required for doubles</p>

    <div class="player-input-group">
      <input
        type="text"
        id="playerNameInput"
        class="input-clay"
        placeholder="Enter player name"
        maxlength="30"
        autocomplete="off"
      />
      <button id="addPlayerBtn" class="btn btn-primary btn-md">
        Add Player
      </button>
    </div>

    <div id="playerRoster" class="player-roster">
      <!-- Player cards will be added here dynamically -->
    </div>

    <div id="tournamentSetup" class="tournament-setup hidden">
      <div class="setup-row">
        <label for="courtCount" class="setup-label">Number of Courts:</label>
        <input
          type="number"
          id="courtCount"
          class="input-number"
          value="2"
          min="1"
          max="4"
        />
      </div>
      <button id="startTournamentBtn" class="btn btn-secondary btn-lg btn-full">
        Start Tournament
      </button>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify HTML structure**

Open `index.html` in browser
Expected: See player management section (unstyled)

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add player management HTML structure"
```

### Task 6: Player Management Styles

**Files:**
- Modify: `css/components.css`

- [ ] **Step 1: Add card and input styles**

```css
/* Append to css/components.css */

/* Cards */
.card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-clay-card);
  transition: all var(--transition-slow);
}

@media (min-width: 768px) {
  .card {
    padding: var(--spacing-xl);
    border-radius: var(--radius-2xl);
  }
}

.section {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-xs);
  color: var(--clay-foreground);
}

.section-subtitle {
  font-size: 0.875rem;
  color: var(--clay-muted);
  margin-bottom: var(--spacing-lg);
}

/* Inputs */
.input-clay {
  width: 100%;
  height: 3.5rem;
  padding: 0 var(--spacing-lg);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  color: var(--clay-foreground);
  background: #EFEBF5;
  border: none;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-clay-pressed);
  transition: all var(--transition-base);
}

.input-clay::placeholder {
  color: var(--clay-muted);
}

.input-clay:focus {
  outline: none;
  background: white;
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.2);
}

.input-number {
  width: 80px;
  height: 2.5rem;
  padding: 0 var(--spacing-sm);
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 700;
  text-align: center;
  color: var(--clay-foreground);
  background: #EFEBF5;
  border: none;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-clay-pressed);
}

.input-number:focus {
  outline: none;
  background: white;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
}

/* Player Input Group */
.player-input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

@media (min-width: 640px) {
  .player-input-group {
    flex-direction: row;
  }

  .player-input-group .input-clay {
    flex: 1;
  }

  .player-input-group .btn {
    flex-shrink: 0;
  }
}
```

- [ ] **Step 2: Add player roster styles**

```css
/* Append to css/components.css */

/* Player Roster */
.player-roster {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  min-height: 100px;
}

.player-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-clay-card);
  animation: fade-in 300ms ease-out;
}

.player-name {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  color: var(--clay-foreground);
}

.btn-remove {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.1);
  color: #DC2626;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  transition: all var(--transition-fast);
}

.btn-remove:hover {
  background: #DC2626;
  color: white;
  transform: scale(1.1);
}

.btn-remove:active {
  transform: scale(0.9);
}

/* Tournament Setup */
.tournament-setup {
  padding-top: var(--spacing-lg);
  border-top: 2px solid rgba(124, 58, 237, 0.1);
}

.setup-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.setup-label {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  color: var(--clay-foreground);
}
```

- [ ] **Step 3: Verify styles**

Open `index.html` in browser
Expected: See styled card with input field and button

- [ ] **Step 4: Commit**

```bash
git add css/components.css
git commit -m "feat: add player management component styles"
```

---

## Chunk 3: JavaScript State Management & Player Logic

### Task 7: Tournament State Class

**Files:**
- Create: `js/state.js`

- [ ] **Step 1: Create TournamentState class**

```javascript
// js/state.js

export class TournamentState {
  constructor() {
    this.players = [];
    this.matches = [];
    this.currentMatches = [];
    this.completedMatches = [];
    this.courtCount = 2;
    this.tournamentActive = false;
    this.listeners = [];
  }

  // Player Management
  addPlayer(name) {
    const player = {
      id: this.generateId(),
      name: name.trim(),
      matchesPlayed: 0,
      lastMatchIndex: -1
    };
    this.players.push(player);
    this.notify();
    return player;
  }

  removePlayer(playerId) {
    this.players = this.players.filter(p => p.id !== playerId);
    this.notify();
  }

  getPlayers() {
    return [...this.players];
  }

  // Tournament Control
  startTournament(courtCount) {
    this.courtCount = courtCount;
    this.tournamentActive = true;
    this.notify();
  }

  resetTournament() {
    this.players = [];
    this.matches = [];
    this.currentMatches = [];
    this.completedMatches = [];
    this.tournamentActive = false;
    this.notify();
  }

  // Match Management
  setMatches(matches) {
    this.matches = matches;
    this.assignMatchesToCourts();
    this.notify();
  }

  assignMatchesToCourts() {
    const availableMatches = this.matches.filter(m => m.status === 'pending');
    const courtsNeeded = Math.min(this.courtCount, availableMatches.length);

    for (let i = 0; i < courtsNeeded; i++) {
      if (availableMatches[i]) {
        availableMatches[i].status = 'in-progress';
        availableMatches[i].courtNumber = i + 1;
        this.currentMatches.push(availableMatches[i]);
      }
    }
  }

  completeMatch(matchId, team1Score, team2Score) {
    const match = this.matches.find(m => m.id === matchId);
    if (!match) return;

    match.team1Score = team1Score;
    match.team2Score = team2Score;
    match.status = 'completed';

    // Update player stats
    [match.team1.player1, match.team1.player2, match.team2.player1, match.team2.player2].forEach(player => {
      player.matchesPlayed++;
      const matchIndex = this.completedMatches.length;
      player.lastMatchIndex = matchIndex;
    });

    this.completedMatches.push(match);
    this.currentMatches = this.currentMatches.filter(m => m.id !== matchId);

    // Assign next match to freed court
    this.assignMatchesToCourts();
    this.notify();
  }

  getCurrentMatches() {
    return [...this.currentMatches];
  }

  getUpcomingMatches(count = 5) {
    return this.matches
      .filter(m => m.status === 'pending')
      .slice(0, count);
  }

  // State Subscription
  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener(this));
  }

  // Utilities
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

- [ ] **Step 2: Verify module loads**

Create test file `js/main.js`:
```javascript
import { TournamentState } from './state.js';
const state = new TournamentState();
console.log('State initialized:', state);
```

Open browser console
Expected: See "State initialized" with object

- [ ] **Step 3: Commit**

```bash
git add js/state.js js/main.js
git commit -m "feat: add tournament state management class"
```

### Task 8: Match Scheduler Algorithm

**Files:**
- Create: `js/scheduler.js`

- [ ] **Step 1: Create MatchScheduler class with round-robin logic**

```javascript
// js/scheduler.js

export class MatchScheduler {
  constructor(players) {
    this.players = players;
    this.matches = [];
  }

  generateMatches() {
    const teams = this.generateAllTeams();
    const matches = this.createMatches(teams);
    const optimizedMatches = this.optimizeForRest(matches);
    return optimizedMatches;
  }

  generateAllTeams() {
    const teams = [];
    for (let i = 0; i < this.players.length; i++) {
      for (let j = i + 1; j < this.players.length; j++) {
        teams.push({
          player1: this.players[i],
          player2: this.players[j]
        });
      }
    }
    return teams;
  }

  createMatches(teams) {
    const matches = [];
    const usedPairings = new Set();

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1 = teams[i];
        const team2 = teams[j];

        // Check if teams share a player
        if (this.teamsSharePlayer(team1, team2)) continue;

        // Create unique pairing key
        const pairingKey = this.getPairingKey(team1, team2);
        if (usedPairings.has(pairingKey)) continue;

        matches.push({
          id: this.generateId(),
          team1,
          team2,
          team1Score: null,
          team2Score: null,
          status: 'pending',
          courtNumber: null
        });

        usedPairings.add(pairingKey);
      }
    }

    return matches;
  }

  optimizeForRest(matches) {
    const optimized = [];
    const remaining = [...matches];

    while (remaining.length > 0) {
      let bestMatch = null;
      let bestScore = -1;

      for (const match of remaining) {
        const restScore = this.calculateRestScore(match, optimized.length);
        if (restScore > bestScore) {
          bestScore = restScore;
          bestMatch = match;
        }
      }

      if (bestMatch) {
        optimized.push(bestMatch);
        remaining.splice(remaining.indexOf(bestMatch), 1);
      } else {
        break;
      }
    }

    return optimized;
  }

  calculateRestScore(match, currentIndex) {
    const players = [
      match.team1.player1,
      match.team1.player2,
      match.team2.player1,
      match.team2.player2
    ];

    let totalRest = 0;
    for (const player of players) {
      const restPeriod = currentIndex - player.lastMatchIndex;
      totalRest += restPeriod;
    }

    return totalRest;
  }

  teamsSharePlayer(team1, team2) {
    const team1Ids = [team1.player1.id, team1.player2.id];
    const team2Ids = [team2.player1.id, team2.player2.id];
    return team1Ids.some(id => team2Ids.includes(id));
  }

  getPairingKey(team1, team2) {
    const ids = [
      team1.player1.id,
      team1.player2.id,
      team2.player1.id,
      team2.player2.id
    ].sort();
    return ids.join('-');
  }

  generateId() {
    return `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

- [ ] **Step 2: Test scheduler with sample data**

Add to `js/main.js`:
```javascript
import { MatchScheduler } from './scheduler.js';

const testPlayers = [
  { id: '1', name: 'Alice', matchesPlayed: 0, lastMatchIndex: -1 },
  { id: '2', name: 'Bob', matchesPlayed: 0, lastMatchIndex: -1 },
  { id: '3', name: 'Charlie', matchesPlayed: 0, lastMatchIndex: -1 },
  { id: '4', name: 'Diana', matchesPlayed: 0, lastMatchIndex: -1 }
];

const scheduler = new MatchScheduler(testPlayers);
const matches = scheduler.generateMatches();
console.log('Generated matches:', matches);
```

Expected: Console shows array of match objects

- [ ] **Step 3: Commit**

```bash
git add js/scheduler.js js/main.js
git commit -m "feat: add match scheduler with round-robin algorithm"
```

### Task 9: Statistics Calculator

**Files:**
- Create: `js/stats.js`

- [ ] **Step 1: Create StatsCalculator class**

```javascript
// js/stats.js

export class StatsCalculator {
  constructor(players, completedMatches) {
    this.players = players;
    this.completedMatches = completedMatches;
  }

  calculateLeaderboard() {
    return this.players.map(player => {
      const stats = this.calculatePlayerStats(player);
      return {
        player,
        ...stats
      };
    }).sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.winPercentage !== a.winPercentage) return b.winPercentage - a.winPercentage;
      return b.pointsScored - a.pointsScored;
    });
  }

  calculatePlayerStats(player) {
    let wins = 0;
    let losses = 0;
    let pointsScored = 0;
    let pointsConceded = 0;

    for (const match of this.completedMatches) {
      const isTeam1 = match.team1.player1.id === player.id || match.team1.player2.id === player.id;
      const isTeam2 = match.team2.player1.id === player.id || match.team2.player2.id === player.id;

      if (!isTeam1 && !isTeam2) continue;

      if (isTeam1) {
        pointsScored += match.team1Score;
        pointsConceded += match.team2Score;
        if (match.team1Score > match.team2Score) wins++;
        else losses++;
      } else {
        pointsScored += match.team2Score;
        pointsConceded += match.team1Score;
        if (match.team2Score > match.team1Score) wins++;
        else losses++;
      }
    }

    const matchesPlayed = wins + losses;
    const winPercentage = matchesPlayed > 0 ? (wins / matchesPlayed) * 100 : 0;

    return {
      wins,
      losses,
      pointsScored,
      pointsConceded,
      winPercentage: Math.round(winPercentage),
      matchesPlayed
    };
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add js/stats.js
git commit -m "feat: add statistics calculator for leaderboard"
```

---

## Chunk 4: UI Controller & Integration

### Task 10: Court Display & Leaderboard HTML

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add court display HTML**

Replace `<!-- Court Display (Tournament Active) -->` section:

```html
<section id="courtDisplay" class="section hidden">
  <h2 class="section-title">Courts</h2>
  <div id="courtsContainer" class="courts-grid">
    <!-- Courts added dynamically -->
  </div>
</section>
```

- [ ] **Step 2: Add match queue HTML**

Replace `<!-- Match Queue -->` section:

```html
<section id="matchQueue" class="section hidden">
  <button id="queueToggle" class="queue-toggle">
    <span>Next Matches</span>
    <span id="queueCount" class="queue-count">(0)</span>
    <span class="chevron">▼</span>
  </button>
  <div id="queueList" class="queue-list hidden">
    <!-- Matches added dynamically -->
  </div>
</section>
```

- [ ] **Step 3: Add leaderboard modal HTML**

Replace `<!-- Leaderboard Modal -->`:

```html
<div id="leaderboardModal" class="modal hidden">
  <div class="modal-backdrop"></div>
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">Leaderboard</h2>
      <button id="closeLeaderboard" class="btn-close">×</button>
    </div>
    <div class="modal-body">
      <table id="leaderboardTable" class="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th class="sortable" data-sort="wins">Wins</th>
            <th class="sortable" data-sort="winPercentage">Win %</th>
            <th class="sortable" data-sort="pointsScored">Points</th>
          </tr>
        </thead>
        <tbody id="leaderboardBody">
          <!-- Rows added dynamically -->
        </tbody>
      </table>
    </div>
  </div>
</div>

<button id="leaderboardTab" class="leaderboard-tab hidden">
  View Leaderboard
</button>
```

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add court display and leaderboard HTML structure"
```

### Task 11: Court & Leaderboard Styles

**Files:**
- Modify: `css/components.css`

- [ ] **Step 1: Add court styles**

```css
/* Append to css/components.css */

.courts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
}

@media (min-width: 768px) {
  .courts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.court-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-clay-card);
}

.court-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.court-number {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--clay-violet);
}

.court-status {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: var(--clay-emerald);
  color: white;
}

.team-display {
  margin-bottom: var(--spacing-md);
}

.team-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--clay-muted);
  margin-bottom: 0.25rem;
}

.team-players {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--clay-foreground);
}

.vs-divider {
  text-align: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--clay-muted);
  margin: var(--spacing-md) 0;
}

.score-inputs {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.score-input-group {
  flex: 1;
}

.score-input-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--clay-muted);
  margin-bottom: 0.25rem;
}

.score-input-group input {
  width: 100%;
  height: 3rem;
  text-align: center;
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--clay-foreground);
  background: #EFEBF5;
  border: none;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-clay-pressed);
}

.score-input-group input:focus {
  outline: none;
  background: white;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
}

.court-empty {
  text-align: center;
  padding: var(--spacing-2xl) 0;
  color: var(--clay-muted);
  font-style: italic;
  animation: clay-breathe 6s ease-in-out infinite;
}
```

- [ ] **Step 2: Add modal and leaderboard styles**

```css
/* Append to css/components.css */

.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

@media (min-width: 768px) {
  .modal {
    align-items: center;
  }
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  box-shadow: var(--shadow-clay-card);
  overflow: hidden;
  animation: slide-up 500ms ease-out;
}

@media (min-width: 768px) {
  .modal-content {
    border-radius: var(--radius-2xl);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 2px solid rgba(124, 58, 237, 0.1);
}

.modal-title {
  font-size: 1.5rem;
  color: var(--clay-foreground);
}

.btn-close {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(124, 58, 237, 0.1);
  color: var(--clay-violet);
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-close:hover {
  background: var(--clay-violet);
  color: white;
  transform: scale(1.1);
}

.modal-body {
  padding: var(--spacing-lg);
  overflow-y: auto;
  max-height: calc(90vh - 80px);
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table th {
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: 700;
  text-align: left;
  padding: var(--spacing-sm);
  color: var(--clay-muted);
  border-bottom: 2px solid rgba(124, 58, 237, 0.2);
}

.leaderboard-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.leaderboard-table th.sortable:hover {
  color: var(--clay-violet);
}

.leaderboard-table td {
  padding: var(--spacing-sm);
  border-bottom: 1px solid rgba(124, 58, 237, 0.05);
}

.leaderboard-table tr.top-3 {
  background: linear-gradient(90deg, rgba(124, 58, 237, 0.05), transparent);
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 0.875rem;
}

.rank-1 { background: linear-gradient(135deg, #FCD34D, #F59E0B); color: white; }
.rank-2 { background: linear-gradient(135deg, #D1D5DB, #9CA3AF); color: white; }
.rank-3 { background: linear-gradient(135deg, #FBBF24, #D97706); color: white; }

.leaderboard-tab {
  position: fixed;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  padding: var(--spacing-md) var(--spacing-xl);
  background: linear-gradient(135deg, var(--clay-violet-light), var(--clay-violet));
  color: white;
  border: none;
  border-radius: 999px;
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  box-shadow: var(--shadow-clay-button);
  cursor: pointer;
  transition: all var(--transition-base);
}

.leaderboard-tab:hover {
  transform: translateX(-50%) translateY(-4px);
  box-shadow: var(--shadow-clay-button-hover);
}

.leaderboard-tab:active {
  transform: translateX(-50%) scale(0.95);
}
```

- [ ] **Step 3: Add queue styles**

```css
/* Append to css/components.css */

.queue-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.6);
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  color: var(--clay-foreground);
  cursor: pointer;
  transition: all var(--transition-base);
}

.queue-toggle:hover {
  background: rgba(255, 255, 255, 0.8);
}

.queue-count {
  color: var(--clay-violet);
}

.chevron {
  transition: transform var(--transition-base);
}

.queue-toggle.active .chevron {
  transform: rotate(180deg);
}

.queue-list {
  margin-top: var(--spacing-md);
  display: grid;
  gap: var(--spacing-sm);
}

.queue-item {
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}

.queue-item-teams {
  font-family: var(--font-heading);
  font-weight: 700;
  color: var(--clay-foreground);
}
```

- [ ] **Step 4: Commit**

```bash
git add css/components.css
git commit -m "feat: add court display, modal, and leaderboard styles"
```

### Task 12: UI Controller - Part 1 (Player Management)

**Files:**
- Create: `js/ui.js`

- [ ] **Step 1: Create UIController class with player management**

```javascript
// js/ui.js

import { TournamentState } from './state.js';
import { MatchScheduler } from './scheduler.js';
import { StatsCalculator } from './stats.js';

export class UIController {
  constructor() {
    this.state = new TournamentState();
    this.state.subscribe(this.render.bind(this));
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Player management
    document.getElementById('addPlayerBtn').addEventListener('click', () => this.handleAddPlayer());
    document.getElementById('playerNameInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleAddPlayer();
    });

    // Tournament control
    document.getElementById('startTournamentBtn').addEventListener('click', () => this.handleStartTournament());

    // Leaderboard
    document.getElementById('leaderboardTab').addEventListener('click', () => this.showLeaderboard());
    document.getElementById('closeLeaderboard').addEventListener('click', () => this.hideLeaderboard());
    document.querySelector('.modal-backdrop').addEventListener('click', () => this.hideLeaderboard());

    // Queue toggle
    document.getElementById('queueToggle').addEventListener('click', () => this.toggleQueue());
  }

  handleAddPlayer() {
    const input = document.getElementById('playerNameInput');
    const name = input.value.trim();

    if (!name) {
      this.showError(input, 'Please enter a player name');
      return;
    }

    if (name.length < 2) {
      this.showError(input, 'Name must be at least 2 characters');
      return;
    }

    this.state.addPlayer(name);
    input.value = '';
    input.focus();
  }

  handleStartTournament() {
    const players = this.state.getPlayers();

    if (players.length < 4) {
      alert('Minimum 4 players required for doubles tournament');
      return;
    }

    const courtCount = parseInt(document.getElementById('courtCount').value);

    // Generate matches
    const scheduler = new MatchScheduler(players);
    const matches = scheduler.generateMatches();

    this.state.setMatches(matches);
    this.state.startTournament(courtCount);
  }

  renderPlayerManagement() {
    const players = this.state.getPlayers();
    const roster = document.getElementById('playerRoster');
    const setup = document.getElementById('tournamentSetup');

    roster.innerHTML = players.map(player => `
      <div class="player-card animate-fade-in">
        <span class="player-name">${this.escapeHtml(player.name)}</span>
        <button class="btn-remove" data-player-id="${player.id}" onclick="window.uiController.removePlayer('${player.id}')">
          ×
        </button>
      </div>
    `).join('');

    // Show/hide tournament setup
    if (players.length >= 4) {
      setup.classList.remove('hidden');
    } else {
      setup.classList.add('hidden');
    }
  }

  removePlayer(playerId) {
    if (this.state.tournamentActive) return;
    this.state.removePlayer(playerId);
  }

  showError(input, message) {
    input.classList.add('animate-shake');
    setTimeout(() => input.classList.remove('animate-shake'), 300);
    // Could add error message display here
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  render() {
    if (!this.state.tournamentActive) {
      this.renderPlayerManagement();
    } else {
      this.renderTournament();
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add js/ui.js
git commit -m "feat: add UI controller with player management"
```

### Task 13: UI Controller - Part 2 (Tournament Display)

**Files:**
- Modify: `js/ui.js`

- [ ] **Step 1: Add tournament rendering methods**

```javascript
// Append to UIController class in js/ui.js

renderTournament() {
  // Hide player management, show tournament sections
  document.getElementById('playerManagement').classList.add('hidden');
  document.getElementById('courtDisplay').classList.remove('hidden');
  document.getElementById('matchQueue').classList.remove('hidden');
  document.getElementById('leaderboardTab').classList.remove('hidden');

  this.renderCourts();
  this.renderQueue();
  this.renderLeaderboard();
}

renderCourts() {
  const container = document.getElementById('courtsContainer');
  const currentMatches = this.state.getCurrentMatches();
  const courtCount = this.state.courtCount;

  container.innerHTML = '';

  for (let i = 1; i <= courtCount; i++) {
    const match = currentMatches.find(m => m.courtNumber === i);
    const courtCard = this.createCourtCard(i, match);
    container.appendChild(courtCard);
  }
}

createCourtCard(courtNumber, match) {
  const card = document.createElement('div');
  card.className = 'court-card';

  if (!match) {
    card.innerHTML = `
      <div class="court-header">
        <span class="court-number">Court ${courtNumber}</span>
        <span class="court-status" style="background: var(--clay-muted);">Waiting</span>
      </div>
      <div class="court-empty">No match assigned</div>
    `;
    return card;
  }

  card.innerHTML = `
    <div class="court-header">
      <span class="court-number">Court ${courtNumber}</span>
      <span class="court-status">Active</span>
    </div>

    <div class="team-display">
      <div class="team-label">Team 1</div>
      <div class="team-players">${this.escapeHtml(match.team1.player1.name)} + ${this.escapeHtml(match.team1.player2.name)}</div>
    </div>

    <div class="vs-divider">VS</div>

    <div class="team-display">
      <div class="team-label">Team 2</div>
      <div class="team-players">${this.escapeHtml(match.team2.player1.name)} + ${this.escapeHtml(match.team2.player2.name)}</div>
    </div>

    <div class="score-inputs">
      <div class="score-input-group">
        <label>Team 1 Score</label>
        <input type="number" id="score1-${match.id}" min="0" max="99" inputmode="numeric" />
      </div>
      <div class="score-input-group">
        <label>Team 2 Score</label>
        <input type="number" id="score2-${match.id}" min="0" max="99" inputmode="numeric" />
      </div>
    </div>

    <button class="btn btn-primary btn-md btn-full" onclick="window.uiController.completeMatch('${match.id}')">
      Complete Match
    </button>
  `;

  return card;
}

completeMatch(matchId) {
  const score1Input = document.getElementById(`score1-${matchId}`);
  const score2Input = document.getElementById(`score2-${matchId}`);

  const score1 = parseInt(score1Input.value);
  const score2 = parseInt(score2Input.value);

  // Validation
  if (isNaN(score1) || isNaN(score2)) {
    alert('Please enter both scores');
    return;
  }

  if (score1 < 21 && score2 < 21) {
    alert('At least one team must reach 21 points');
    return;
  }

  if (Math.abs(score1 - score2) < 2 && (score1 >= 21 || score2 >= 21)) {
    if (Math.max(score1, score2) < 30) {
      alert('Must win by 2 points (or reach 30)');
      return;
    }
  }

  this.state.completeMatch(matchId, score1, score2);
}

renderQueue() {
  const upcoming = this.state.getUpcomingMatches(5);
  const countEl = document.getElementById('queueCount');
  const listEl = document.getElementById('queueList');

  countEl.textContent = `(${upcoming.length})`;

  listEl.innerHTML = upcoming.map((match, index) => `
    <div class="queue-item">
      <div class="queue-item-teams">
        ${index + 1}. ${this.escapeHtml(match.team1.player1.name)} + ${this.escapeHtml(match.team1.player2.name)}
        vs
        ${this.escapeHtml(match.team2.player1.name)} + ${this.escapeHtml(match.team2.player2.name)}
      </div>
    </div>
  `).join('');
}

toggleQueue() {
  const toggle = document.getElementById('queueToggle');
  const list = document.getElementById('queueList');

  toggle.classList.toggle('active');
  list.classList.toggle('hidden');
}
```

- [ ] **Step 2: Commit**

```bash
git add js/ui.js
git commit -m "feat: add tournament display rendering to UI controller"
```

### Task 14: UI Controller - Part 3 (Leaderboard)

**Files:**
- Modify: `js/ui.js`

- [ ] **Step 1: Add leaderboard methods**

```javascript
// Append to UIController class in js/ui.js

renderLeaderboard() {
  const players = this.state.getPlayers();
  const completedMatches = this.state.completedMatches;

  const calculator = new StatsCalculator(players, completedMatches);
  const leaderboard = calculator.calculateLeaderboard();

  const tbody = document.getElementById('leaderboardBody');

  tbody.innerHTML = leaderboard.map((entry, index) => {
    const rank = index + 1;
    const isTop3 = rank <= 3;

    return `
      <tr class="${isTop3 ? 'top-3' : ''}">
        <td>
          ${isTop3
            ? `<span class="rank-badge rank-${rank}">${rank}</span>`
            : rank
          }
        </td>
        <td><strong>${this.escapeHtml(entry.player.name)}</strong></td>
        <td>${entry.wins}</td>
        <td>${entry.winPercentage}%</td>
        <td>${entry.pointsScored}</td>
      </tr>
    `;
  }).join('');
}

showLeaderboard() {
  this.renderLeaderboard();
  document.getElementById('leaderboardModal').classList.remove('hidden');
}

hideLeaderboard() {
  document.getElementById('leaderboardModal').classList.add('hidden');
}
```

- [ ] **Step 2: Commit**

```bash
git add js/ui.js
git commit -m "feat: add leaderboard rendering to UI controller"
```

### Task 15: Main App Integration

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Initialize app**

```javascript
// js/main.js

import { UIController } from './ui.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.uiController = new UIController();
  console.log('Badminton Tournament Manager initialized');
});
```

- [ ] **Step 2: Test full application**

Open `index.html` in browser
Test flow:
1. Add 4+ players
2. Start tournament
3. Complete a match with valid scores
4. View leaderboard
5. Check queue updates

Expected: Full tournament flow works

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: integrate all components in main app"
```

---

## Chunk 5: Final Polish & Deployment

### Task 16: Error Handling & Edge Cases

**Files:**
- Modify: `js/ui.js`

- [ ] **Step 1: Add comprehensive validation**

Add to UIController class:

```javascript
validateMatchScore(score1, score2) {
  if (isNaN(score1) || isNaN(score2)) {
    return { valid: false, message: 'Please enter both scores' };
  }

  if (score1 < 0 || score2 < 0) {
    return { valid: false, message: 'Scores cannot be negative' };
  }

  const maxScore = Math.max(score1, score2);
  const minScore = Math.min(score1, score2);

  if (maxScore < 21) {
    return { valid: false, message: 'Winning score must be at least 21' };
  }

  if (maxScore < 30 && (maxScore - minScore) < 2) {
    return { valid: false, message: 'Must win by 2 points (or reach 30)' };
  }

  return { valid: true };
}
```

Update `completeMatch` to use validation:

```javascript
completeMatch(matchId) {
  const score1Input = document.getElementById(`score1-${matchId}`);
  const score2Input = document.getElementById(`score2-${matchId}`);

  const score1 = parseInt(score1Input.value);
  const score2 = parseInt(score2Input.value);

  const validation = this.validateMatchScore(score1, score2);

  if (!validation.valid) {
    alert(validation.message);
    return;
  }

  this.state.completeMatch(matchId, score1, score2);
}
```

- [ ] **Step 2: Commit**

```bash
git add js/ui.js
git commit -m "feat: add comprehensive score validation"
```

### Task 17: Responsive Testing & Fixes

**Files:**
- Modify: `css/components.css` (if needed)

- [ ] **Step 1: Test on mobile viewport**

Open browser DevTools, set to iPhone SE (375px)
Test:
- Player input full width
- Buttons full width
- Cards stack properly
- Modal slides from bottom
- Touch targets at least 44px

- [ ] **Step 2: Test on tablet viewport**

Set to iPad (768px)
Test:
- 2-column court grid
- Leaderboard shows all columns
- Buttons auto-width

- [ ] **Step 3: Test on desktop**

Set to 1280px
Test:
- Max-width container
- All features accessible
- Hover states work

- [ ] **Step 4: Fix any issues found**

Make necessary CSS adjustments

- [ ] **Step 5: Commit**

```bash
git add css/components.css
git commit -m "fix: responsive layout adjustments"
```

### Task 18: Netlify Deployment Setup

**Files:**
- Create: `netlify.toml`
- Create: `README.md`

- [ ] **Step 1: Create Netlify configuration**

```toml
# netlify.toml

[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer"
```

- [ ] **Step 2: Create README**

```markdown
# Badminton Tournament Manager

A mobile-first web application for managing badminton doubles tournaments with intelligent round-robin scheduling.

## Features

- Add/remove players
- Automatic round-robin match generation
- Smart rest period optimization
- Real-time leaderboard with statistics
- Mobile-optimized interface
- No backend required

## Deployment

This is a static site that can be deployed to Netlify:

1. Push to GitHub
2. Connect repository to Netlify
3. Deploy (no build step required)

## Local Development

Simply open `index.html` in a modern browser. No build tools required.

## Tech Stack

- Vanilla HTML5, CSS3, JavaScript ES6+
- High-Fidelity Claymorphism design system
- Google Fonts (Nunito + DM Sans)
```

- [ ] **Step 3: Commit**

```bash
git add netlify.toml README.md
git commit -m "docs: add Netlify config and README"
```

### Task 19: Final Testing & Bug Fixes

**Files:**
- All files (as needed)

- [ ] **Step 1: Complete end-to-end test**

Test complete tournament flow:
1. Add 5 players (test odd number)
2. Start tournament with 2 courts
3. Complete all matches
4. Verify leaderboard accuracy
5. Test queue updates
6. Test all responsive breakpoints

- [ ] **Step 2: Fix any bugs found**

Document and fix issues

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "fix: final bug fixes and polish"
```

### Task 20: Deployment

**Files:**
- None (deployment step)

- [ ] **Step 1: Create GitHub repository**

```bash
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Deploy to Netlify**

1. Log in to Netlify
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub repository
4. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `.`
5. Click "Deploy site"

- [ ] **Step 3: Verify deployment**

Open deployed URL
Test full tournament flow on actual mobile device

- [ ] **Step 4: Celebrate!**

Tournament manager is live!

---

## Plan Complete

This plan provides a complete, step-by-step implementation of the badminton tournament manager with:

- Mobile-first High-Fidelity Claymorphism design
- Intelligent round-robin scheduling with rest optimization
- Real-time statistics and leaderboard
- Full responsive support
- Zero backend dependencies
- Ready for Netlify deployment

Each task includes specific code, verification steps, and commits following TDD principles where applicable.