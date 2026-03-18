// js/state.js

export class TournamentState {
  constructor() {
    this.players = [];
    this.matches = [];
    this.currentMatches = [];
    this.completedMatches = [];
    this.courtCount = 1;
    this.tournamentActive = false;
    this.tournamentMode = 'balanced'; // 'balanced' or 'random'
    this.listeners = [];
    this.usedAvatars = new Set();
    this.availableAvatars = [
      '🦁', '🐯', '🐻', '🐼', '🐨', '🐸', '🐵', '🦊',
      '🦅', '🦉', '🦋', '🐝', '🐞', '🦖', '🦕', '🐙',
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦝', '🐮', '🐷',
      '🐗', '🐴', '🦄', '🐔', '🐧', '🐦', '🐤', '🦆',
      '🦢', '🦜', '🦩', '🦚', '🦃', '🐺', '🦇', '🐴',
      '🦓', '🦌', '🦒', '🦘', '🦬', '🐘', '🦏', '🦛',
      '🐪', '🐫', '🦙', '🦥', '🦦', '🦨', '🦡', '🐾',
      '🐉', '🐲', '🦎', '🐢', '🐊', '🐍', '🐳', '🐋',
      '🐬', '🦈', '🐟', '🐠', '🐡', '🦐', '🦑', '🐚'
    ];
  }

  // Player Management
  addPlayer(name) {
    const player = {
      id: this.generateId(),
      name: name.trim(),
      avatar: this.getUniqueAvatar(),
      matchesPlayed: 0,
      lastMatchIndex: -1
    };
    this.players.push(player);
    this.notify();
    return player;
  }

  getUniqueAvatar() {
    // Get available avatars that haven't been used
    const available = this.availableAvatars.filter(avatar => !this.usedAvatars.has(avatar));

    // If all avatars are used, reset and start over
    if (available.length === 0) {
      this.usedAvatars.clear();
      return this.availableAvatars[Math.floor(Math.random() * this.availableAvatars.length)];
    }

    // Pick a random available avatar
    const avatar = available[Math.floor(Math.random() * available.length)];
    this.usedAvatars.add(avatar);
    return avatar;
  }

  removePlayer(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (player && player.avatar) {
      this.usedAvatars.delete(player.avatar);
    }
    this.players = this.players.filter(p => p.id !== playerId);
    this.notify();
  }

  shufflePlayers() {
    // Fisher-Yates shuffle algorithm
    const shuffled = [...this.players];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    this.players = shuffled;
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

  setTournamentMode(mode) {
    this.tournamentMode = mode;
  }

  getTournamentMode() {
    return this.tournamentMode;
  }

  resetTournament() {
    this.players = [];
    this.matches = [];
    this.currentMatches = [];
    this.completedMatches = [];
    this.tournamentActive = false;
    this.tournamentMode = 'balanced';
    this.notify();
  }

  // Match Management
  setMatches(matches) {
    this.matches = matches;
    this.assignMatchesToCourts();
    this.notify();
  }

  assignMatchesToCourts() {
    // Get all pending matches
    const availableMatches = this.matches.filter(m => m.status === 'pending');

    console.log('🏟️ assignMatchesToCourts called:');
    console.log('  Total matches:', this.matches.length);
    console.log('  Available (pending) matches:', availableMatches.length);
    console.log('  Court count:', this.courtCount);
    console.log('  Current matches:', this.currentMatches.length);

    // Fill all available courts
    for (let courtNum = 1; courtNum <= this.courtCount; courtNum++) {
      // Check if this court already has a match
      const courtHasMatch = this.currentMatches.some(m => m.courtNumber === courtNum);

      if (!courtHasMatch && availableMatches.length > 0) {
        // Assign next available match to this court
        const match = availableMatches.shift();
        match.status = 'in-progress';
        match.courtNumber = courtNum;
        this.currentMatches.push(match);
        console.log(`  ✅ Assigned Match ${match.id} to Court ${courtNum}`);
      } else if (courtHasMatch) {
        console.log(`  ⏭️  Court ${courtNum} already has a match`);
      } else {
        console.log(`  ❌ Court ${courtNum} - no available matches`);
      }
    }

    console.log('  Final current matches:', this.currentMatches.length);
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

