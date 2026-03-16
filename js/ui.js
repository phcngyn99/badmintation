// js/ui.js

import { TournamentState } from './state.js';
import { MatchScheduler } from './scheduler.js';
import { StatsCalculator } from './stats.js';

export class UIController {
  constructor() {
    this.state = new TournamentState();
    this.state.subscribe(this.render.bind(this));
    this.initializeEventListeners();
    this.render(); // Initial render
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

    // Generate matches with court count for optimal rest scheduling
    const scheduler = new MatchScheduler(players);
    const matches = scheduler.generateMatches(courtCount);

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

  // Tournament Display Methods
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
}
