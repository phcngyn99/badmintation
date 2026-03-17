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
    document.getElementById('playerCountBadge').addEventListener('click', () => this.handleShufflePlayers());
    document.getElementById('startTournamentBtn').addEventListener('click', () => this.handleStartTournament());

    // Mode switch
    document.querySelectorAll('input[name="tournamentMode"]').forEach(radio => {
      radio.addEventListener('change', () => this.updateModePreview());
    });

    // Court count change
    document.getElementById('courtCount').addEventListener('input', () => {
      const players = this.state.getPlayers();
      if (players.length >= 4) {
        this.updateCourtInfo(players);
        this.updateMatchPreview(players); // Update match preview when courts change
      }
    });

    // Leaderboard
    document.getElementById('leaderboardTab').addEventListener('click', () => this.showLeaderboard());
    document.getElementById('closeLeaderboard').addEventListener('click', () => this.hideLeaderboard());
    document.querySelector('.modal-backdrop').addEventListener('click', () => this.hideLeaderboard());

    // Queue toggle
    document.getElementById('queueToggle').addEventListener('click', () => this.toggleQueue());
  }

  handleAddPlayer() {
    try {
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
    } catch (error) {
      console.error('Error adding player:', error);
      alert('Error adding player: ' + error.message);
    }
  }

  handleShufflePlayers() {
    const players = this.state.getPlayers();

    if (players.length < 6) {
      alert('Need at least 6 players to shuffle');
      return;
    }

    console.log('Before shuffle:', players.map(p => p.name).join(', '));

    // Add shuffle animation to roster
    const roster = document.getElementById('playerRoster');
    roster.style.opacity = '0.5';
    roster.style.transform = 'scale(0.98)';

    setTimeout(() => {
      // Shuffle the player list
      this.state.shufflePlayers();

      console.log('After shuffle:', this.state.getPlayers().map(p => p.name).join(', '));

      // Force re-render
      this.renderPlayerManagement();

      // Regenerate match preview with new order
      this.updateMatchPreview(this.state.getPlayers());

      // Reset animation
      roster.style.opacity = '1';
      roster.style.transform = 'scale(1)';
    }, 150);
  }

  handleStartTournament() {
    const players = this.state.getPlayers();

    if (players.length < 4) {
      alert('Minimum 4 players required for doubles tournament');
      return;
    }

    const courtCount = parseInt(document.getElementById('courtCount').value);
    // Get selected mode from radio buttons
    const mode = document.querySelector('input[name="tournamentMode"]:checked').value;

    // Validate Round-Robin mode
    if (mode === 'balanced' && (players.length < 6 || players.length > 9)) {
      alert('Round-Robin mode requires 6-9 players. Please use Random Pairs mode or adjust player count.');
      return;
    }

    console.log('Starting tournament with mode:', mode, 'players:', players.length);

    // Generate matches with court count for optimal rest scheduling
    const scheduler = new MatchScheduler(players, mode);
    const matches = scheduler.generateMatches(courtCount);

    console.log('Generated matches:', matches.length);

    this.state.setMatches(matches);
    this.state.setTournamentMode(mode);
    this.state.startTournament(courtCount);
  }

  showNotification(message) {
    // Simple notification - could be enhanced with a toast component
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--yonex-blue);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  renderPlayerManagement() {
    try {
      const players = this.state.getPlayers();
      const roster = document.getElementById('playerRoster');
      const setup = document.getElementById('tournamentSetup');
      const playerCountEl = document.getElementById('playerCount');

      if (!roster || !setup || !playerCountEl) {
        console.error('Required elements not found');
        return;
      }

      // Update player count badge
      playerCountEl.textContent = players.length;

      roster.innerHTML = players.map(player => `
        <div class="player-card animate-fade-in">
          <div class="player-info">
            <span class="player-avatar">${player.avatar || '👤'}</span>
            <span class="player-name">${this.escapeHtml(player.name)}</span>
          </div>
          <button class="btn-remove" data-player-id="${player.id}" onclick="window.uiController.removePlayer('${player.id}')">
            ×
          </button>
        </div>
      `).join('');

      // Show/hide tournament setup
      if (players.length >= 4) {
        setup.classList.remove('hidden');
        this.updateMatchCounts(players);
        this.updateModePreview();
        this.updateModeAvailability(players.length);
      } else {
        setup.classList.add('hidden');
      }
    } catch (error) {
      console.error('Error rendering player management:', error);
    }
  }

  updateModeAvailability(playerCount) {
    const balancedRadio = document.getElementById('modeBalanced');
    const randomRadio = document.getElementById('modeRandom');
    const balancedLabel = document.querySelector('label[for="modeBalanced"]');
    const randomLabel = document.querySelector('label[for="modeRandom"]');
    const modeHint = document.getElementById('modeHint');

    let hint = '';

    // Round-Robin: 6-9 players
    if (playerCount >= 6 && playerCount <= 9) {
      balancedRadio.disabled = false;
      if (balancedLabel) {
        balancedLabel.style.opacity = '1';
        balancedLabel.style.cursor = 'pointer';
      }
    } else {
      balancedRadio.disabled = true;
      if (balancedLabel) {
        balancedLabel.style.opacity = '0.5';
        balancedLabel.style.cursor = 'not-allowed';
      }
      if (playerCount < 6) {
        hint = 'Round-Robin requires 6-9 players. ';
      } else if (playerCount > 9) {
        hint = 'Round-Robin supports max 9 players. ';
      }
    }

    // Random Pairs: 4-16 players
    if (playerCount >= 4 && playerCount <= 16) {
      randomRadio.disabled = false;
      if (randomLabel) {
        randomLabel.style.opacity = '1';
        randomLabel.style.cursor = 'pointer';
      }
    } else {
      randomRadio.disabled = true;
      if (randomLabel) {
        randomLabel.style.opacity = '0.5';
        randomLabel.style.cursor = 'not-allowed';
      }
      if (playerCount > 16) {
        hint += 'Random Pairs supports max 16 players.';
      }
    }

    // Auto-select available mode
    if (balancedRadio.disabled && !randomRadio.disabled) {
      randomRadio.checked = true;
    } else if (randomRadio.disabled && !balancedRadio.disabled) {
      balancedRadio.checked = true;
    }

    if (modeHint) {
      modeHint.textContent = hint;
      modeHint.style.color = 'var(--clay-yonex-lime)';
      modeHint.style.fontSize = '0.9rem';
      modeHint.style.marginTop = '0.5rem';
    }
  }

  updateMatchCounts(players) {
    const balancedCountEl = document.getElementById('balancedMatchCount');
    const randomCountEl = document.getElementById('randomMatchCount');
    const courtCountInput = document.getElementById('courtCount');
    const courtHintEl = document.getElementById('courtHint');
    const courtInfoEl = document.getElementById('courtInfo');

    if (!balancedCountEl || !randomCountEl || !courtCountInput || !players || players.length < 4) return;

    // Get selected mode
    const selectedMode = document.querySelector('input[name="tournamentMode"]:checked')?.value || 'balanced';

    // Calculate recommended courts based on mode
    let recommendedCourts = 1;
    let estimatedDuration = 0;

    if (selectedMode === 'balanced') {
      // Round-Robin: always 1 court
      recommendedCourts = 1;
      const matchCounts = { 6: 8, 7: 11, 8: 14, 9: 18 };
      const matches = matchCounts[players.length] || 0;
      estimatedDuration = (matches * 15 / 60).toFixed(1);
    } else {
      // Random Pairs: calculate optimal courts
      const pairs = Math.floor(players.length / 2);
      const totalMatches = pairs * (pairs - 1) / 2;
      const targetRounds = 12; // ~3 hours
      recommendedCourts = Math.min(6, Math.max(1, Math.ceil(totalMatches / targetRounds)));
      const estimatedRounds = Math.ceil(totalMatches / recommendedCourts);
      estimatedDuration = (estimatedRounds * 15 / 60).toFixed(1);
    }

    // Calculate maximum courts based on player count
    const maxCourts = Math.floor(players.length / 4);
    const constrainedMaxCourts = Math.max(1, Math.min(maxCourts, 6)); // Between 1-6

    // Update court input constraints
    courtCountInput.max = constrainedMaxCourts;

    // Update hint text
    if (courtHintEl) {
      courtHintEl.textContent = `(recommended, max ${constrainedMaxCourts})`;
    }

    // Auto-set to recommended courts (but allow user to change)
    courtCountInput.value = recommendedCourts;

    // Update court info
    this.updateCourtInfo(players);

    // Calculate balanced mode matches
    const balancedScheduler = new MatchScheduler(players, 'balanced');
    const allMatches = balancedScheduler.generateMatches(courtCount);
    const optionalMatches = allMatches.filter(m => m.isOptional).length;
    const requiredMatches = allMatches.length - optionalMatches;

    // Calculate random mode matches (based on player count)
    const randomMatches = this.calculateRandomMatches(players.length);

    // Update the UI - for Round-Robin, show all partnerships
    if (optionalMatches > 0) {
      balancedCountEl.textContent = `${requiredMatches} + ${optionalMatches} optional`;
    } else {
      balancedCountEl.textContent = `${allMatches.length} matches`;
    }

    randomCountEl.textContent = `${randomMatches} matches`;

    // Update match preview
    this.updateMatchPreview(players);
  }

  calculateRandomMatches(playerCount) {
    // For random mode, calculate reasonable number of matches
    // Each match uses 4 players, so we want enough matches for variety
    // Formula: aim for each player to play 6-8 matches
    const targetMatchesPerPlayer = 7;
    const totalPlayerSlots = targetMatchesPerPlayer * playerCount;
    const matches = Math.floor(totalPlayerSlots / 4);

    return Math.min(matches, 30); // Cap at 30 matches
  }

  updateMatchPreview(players) {
    const previewListEl = document.getElementById('matchPreviewList');
    const previewCountEl = document.getElementById('previewMatchCount');

    if (!previewListEl || !previewCountEl || !players || players.length < 4) {
      return;
    }

    // Get selected mode
    const mode = document.querySelector('input[name="tournamentMode"]:checked')?.value || 'balanced';
    const courtCount = parseInt(document.getElementById('courtCount')?.value || 1);

    // Generate preview matches
    const scheduler = new MatchScheduler(players, mode);
    const matches = scheduler.generateMatches(courtCount);

    // Update count
    const optionalCount = matches.filter(m => m.isOptional).length;
    const requiredCount = matches.length - optionalCount;

    if (optionalCount > 0) {
      previewCountEl.textContent = `${requiredCount} matches + ${optionalCount} optional`;
    } else {
      previewCountEl.textContent = `${matches.length} matches`;
    }

    // Display first 10 matches as preview
    const previewMatches = matches.slice(0, 10);

    previewListEl.innerHTML = previewMatches.map((match, index) => {
      const optionalBadge = match.isOptional ? '<span class="optional-badge">Optional</span>' : '';

      // Sort players within each team by rest (most rested on left, just played on right)
      const getRestValue = (restStr) => {
        if (restStr === 'Fresh') return Infinity;
        const match = restStr.match(/(\d+) rest/);
        return match ? parseInt(match[1]) : 0;
      };

      // Team 1 players with rest values
      const team1Players = [
        { player: match.team1.player1, rest: match.restInfo ? getRestValue(match.restInfo.team1[0]) : 0 },
        { player: match.team1.player2, rest: match.restInfo ? getRestValue(match.restInfo.team1[1]) : 0 }
      ];

      // Team 2 players with rest values
      const team2Players = [
        { player: match.team2.player1, rest: match.restInfo ? getRestValue(match.restInfo.team2[0]) : 0 },
        { player: match.team2.player2, rest: match.restInfo ? getRestValue(match.restInfo.team2[1]) : 0 }
      ];

      // Sort each team by rest (ascending - just played first, most rested last)
      team1Players.sort((a, b) => a.rest - b.rest);
      team2Players.sort((a, b) => a.rest - b.rest);

      return `
        <div class="match-preview-item ${match.healthWarning ? 'health-warning' : ''}">
          <span class="match-preview-number">${index + 1}</span>
          <span class="match-preview-teams">
            <span class="match-preview-team">
              <span class="player-avatar-small">${team1Players[0].player.avatar || '👤'}</span>
              ${this.escapeHtml(team1Players[0].player.name)}
              -
              <span class="player-avatar-small">${team1Players[1].player.avatar || '👤'}</span>
              ${this.escapeHtml(team1Players[1].player.name)}
            </span>
            <span class="match-preview-vs">vs</span>
            <span class="match-preview-team">
              <span class="player-avatar-small">${team2Players[0].player.avatar || '👤'}</span>
              ${this.escapeHtml(team2Players[0].player.name)}
              -
              <span class="player-avatar-small">${team2Players[1].player.avatar || '👤'}</span>
              ${this.escapeHtml(team2Players[1].player.name)}
            </span>
          </span>
          ${optionalBadge}
        </div>
      `;
    }).join('');

    // Add "show more" indicator if there are more matches
    if (matches.length > 10) {
      previewListEl.innerHTML += `
        <div class="match-preview-item" style="justify-content: center; color: var(--clay-muted); font-style: italic;">
          ... and ${matches.length - 10} more matches
        </div>
      `;
    }
  }

  updateCourtInfo(players) {
    const courtInfoEl = document.getElementById('courtInfo');
    const courtCountInput = document.getElementById('courtCount');

    if (!courtInfoEl || !courtCountInput || !players || players.length < 4) return;

    const selectedMode = document.querySelector('input[name="tournamentMode"]:checked')?.value || 'balanced';
    const courts = parseInt(courtCountInput.value) || 1;

    let estimatedDuration = 0;
    let totalMatches = 0;

    if (selectedMode === 'balanced') {
      // Round-Robin: always 1 court (sequential)
      const matchCounts = { 6: 8, 7: 11, 8: 14, 9: 18 };
      totalMatches = matchCounts[players.length] || 0;
      estimatedDuration = (totalMatches * 15 / 60).toFixed(1);
    } else {
      // Random Pairs: calculate based on actual court count
      const pairs = Math.floor(players.length / 2);
      totalMatches = pairs * (pairs - 1) / 2;
      const estimatedRounds = Math.ceil(totalMatches / courts);
      estimatedDuration = (estimatedRounds * 15 / 60).toFixed(1);
    }

    // Create highlighted duration text
    courtInfoEl.innerHTML = `${totalMatches} matches, estimated duration: <span class="duration-highlight">~${estimatedDuration} hours</span> with ${courts} court${courts > 1 ? 's' : ''}`;
  }

  updateModePreview() {
    // Trigger match preview update when mode changes
    const players = this.state.getPlayers();
    if (players.length >= 6) {
      this.updateMatchPreview(players);
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
        <div class="team-players">
          <span class="player-avatar-small">${match.team1.player1.avatar || '👤'}</span>
          ${this.escapeHtml(match.team1.player1.name)}
          -
          <span class="player-avatar-small">${match.team1.player2.avatar || '👤'}</span>
          ${this.escapeHtml(match.team1.player2.name)}
        </div>
      </div>

      <div class="vs-divider">VS</div>

      <div class="team-display">
        <div class="team-label">Team 2</div>
        <div class="team-players">
          <span class="player-avatar-small">${match.team2.player1.avatar || '👤'}</span>
          ${this.escapeHtml(match.team2.player1.name)}
          -
          <span class="player-avatar-small">${match.team2.player2.avatar || '👤'}</span>
          ${this.escapeHtml(match.team2.player2.name)}
        </div>
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
          ${index + 1}.
          <span class="player-avatar-small">${match.team1.player1.avatar || '👤'}</span>
          ${this.escapeHtml(match.team1.player1.name)} -
          <span class="player-avatar-small">${match.team1.player2.avatar || '👤'}</span>
          ${this.escapeHtml(match.team1.player2.name)}
          vs
          <span class="player-avatar-small">${match.team2.player1.avatar || '👤'}</span>
          ${this.escapeHtml(match.team2.player1.name)} -
          <span class="player-avatar-small">${match.team2.player2.avatar || '👤'}</span>
          ${this.escapeHtml(match.team2.player2.name)}
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
    const mode = this.state.getTournamentMode();

    const calculator = new StatsCalculator(players, completedMatches, mode);
    const leaderboard = calculator.calculateLeaderboard();

    const tbody = document.getElementById('leaderboardBody');
    const thead = document.querySelector('#leaderboardTable thead tr');

    const playerCount = players.length;
    const useWinPercentage = playerCount === 6 || playerCount === 7;

    // Update table headers based on mode and player count
    if (mode === 'random') {
      thead.innerHTML = `
        <th>Rank</th>
        <th>Pair</th>
        <th class="sortable" data-sort="wins">Wins</th>
        <th class="sortable" data-sort="winPercentage">Win %</th>
        <th class="sortable" data-sort="pointsScored">Points</th>
      `;
    } else {
      // Round-Robin mode: different headers for 6/7 vs 8 players
      if (useWinPercentage) {
        thead.innerHTML = `
          <th>Rank</th>
          <th>Player</th>
          <th class="sortable" data-sort="winPercentage">Win %</th>
          <th class="sortable" data-sort="wins">Wins</th>
          <th class="sortable" data-sort="matchesPlayed">Matches</th>
        `;
      } else {
        thead.innerHTML = `
          <th>Rank</th>
          <th>Player</th>
          <th class="sortable" data-sort="wins">Points</th>
          <th class="sortable" data-sort="winPercentage">Win %</th>
          <th class="sortable" data-sort="pointsScored">Score</th>
        `;
      }
    }

    tbody.innerHTML = leaderboard.map((entry, index) => {
      const rank = index + 1;
      const isTop3 = rank <= 3;

      // Different display for random mode (pairs) vs balanced mode (players)
      const nameDisplay = mode === 'random'
        ? `<span class="player-avatar-small">${entry.player1.avatar || '👤'}</span> ${this.escapeHtml(entry.player1.name)} - <span class="player-avatar-small">${entry.player2.avatar || '👤'}</span> ${this.escapeHtml(entry.player2.name)}`
        : `<span class="player-avatar-small">${entry.player.avatar || '👤'}</span> ${this.escapeHtml(entry.player.name)}`;

      // Different columns based on mode and player count
      let statsColumns;
      if (mode === 'random') {
        statsColumns = `
          <td>${entry.wins}</td>
          <td>${entry.winPercentage}%</td>
          <td>${entry.pointsScored}</td>
        `;
      } else if (useWinPercentage) {
        // 6 & 7 players: Show Win % first
        statsColumns = `
          <td><strong>${entry.winPercentage}%</strong></td>
          <td>${entry.wins}</td>
          <td>${entry.matchesPlayed}</td>
        `;
      } else {
        // 8 players: Show Points first
        statsColumns = `
          <td><strong>${entry.wins}</strong></td>
          <td>${entry.winPercentage}%</td>
          <td>${entry.pointsScored}</td>
        `;
      }

      return `
        <tr class="${isTop3 ? 'top-3' : ''}">
          <td>
            ${isTop3
              ? `<span class="rank-badge rank-${rank}">${rank}</span>`
              : rank
            }
          </td>
          <td><strong>${nameDisplay}</strong></td>
          ${statsColumns}
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
