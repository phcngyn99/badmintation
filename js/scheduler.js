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

