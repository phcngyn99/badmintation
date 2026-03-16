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

