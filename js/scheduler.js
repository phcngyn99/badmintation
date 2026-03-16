// js/scheduler.js

export class MatchScheduler {
  constructor(players) {
    this.players = players;
    this.matches = [];
  }

  generateMatches(courtCount = 2) {
    const teams = this.generateAllTeams();
    const matches = this.createMatches(teams);
    const optimizedMatches = this.optimizeForRest(matches, courtCount);
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

  optimizeForRest(matches, courtCount) {
    const optimized = [];
    const remaining = [...matches];

    // Track when each player last played (match index)
    const playerLastMatch = new Map();
    this.players.forEach(p => playerLastMatch.set(p.id, -1));

    // Calculate minimum rest needed based on players and courts
    const minRestGap = this.calculateMinRestGap(this.players.length, courtCount);

    let currentRound = 0;

    while (remaining.length > 0) {
      // Try to schedule matches for this round
      // Maximum matches = min(courtCount, floor(playerCount / 4))
      const maxMatchesThisRound = Math.min(courtCount, Math.floor(this.players.length / 4));
      const roundMatches = [];
      const playersInRound = new Set();

      // Find matches where all players have rested enough
      for (const match of remaining) {
        const matchPlayers = this.getMatchPlayers(match);
        const playerIds = matchPlayers.map(p => p.id);

        // Check if any player in this match is already scheduled this round
        if (playerIds.some(id => playersInRound.has(id))) {
          continue;
        }

        // Check if all players have rested enough
        const allPlayersRested = playerIds.every(id => {
          const lastMatch = playerLastMatch.get(id);
          const restPeriod = currentRound - lastMatch;
          return restPeriod > minRestGap; // Strict: must have MORE than minRestGap
        });

        if (allPlayersRested && roundMatches.length < maxMatchesThisRound) {
          roundMatches.push(match);
          playerIds.forEach(id => playersInRound.add(id));
        }
      }

      // If we couldn't find enough matches with proper rest, relax constraints gradually
      if (roundMatches.length === 0) {
        // Find matches with best rest scores, prioritizing those with longest rest
        const candidateMatches = [];

        for (const match of remaining) {
          const matchPlayers = this.getMatchPlayers(match);
          const playerIds = matchPlayers.map(p => p.id);

          // Skip if players already in this round
          if (playerIds.some(id => playersInRound.has(id))) {
            continue;
          }

          // Calculate rest score (sum of rest periods for all 4 players)
          const restScore = playerIds.reduce((sum, id) => {
            return sum + (currentRound - playerLastMatch.get(id));
          }, 0);

          // Also calculate minimum rest (worst rested player)
          const minRest = Math.min(...playerIds.map(id =>
            currentRound - playerLastMatch.get(id)
          ));

          candidateMatches.push({
            match,
            restScore,
            minRest,
            playerIds
          });
        }

        // Sort by minimum rest first (ensure no one plays back-to-back if possible)
        // Then by total rest score
        candidateMatches.sort((a, b) => {
          if (b.minRest !== a.minRest) return b.minRest - a.minRest;
          return b.restScore - a.restScore;
        });

        // Take the best match
        if (candidateMatches.length > 0) {
          const best = candidateMatches[0];
          roundMatches.push(best.match);
          best.playerIds.forEach(id => playersInRound.add(id));
        }
      }

      // Add round matches to optimized list and update tracking
      roundMatches.forEach(match => {
        optimized.push(match);
        remaining.splice(remaining.indexOf(match), 1);

        // Update last match index for all players in this match
        this.getMatchPlayers(match).forEach(player => {
          playerLastMatch.set(player.id, currentRound);
        });
      });

      currentRound++;

      // Safety check to prevent infinite loop
      if (currentRound > matches.length * 2) {
        // Just add remaining matches
        optimized.push(...remaining);
        break;
      }
    }

    return optimized;
  }

  calculateMinRestGap(playerCount, courtCount) {
    // Dynamic calculation of minimum rest gap
    // Goal: Ensure players don't play too many consecutive matches

    // Actual matches per round is limited by available players
    const maxMatchesPerRound = Math.min(courtCount, Math.floor(playerCount / 4));
    const playersPerRound = maxMatchesPerRound * 4; // 4 players per match

    // Calculate how many players sit out each round
    const playersResting = playerCount - playersPerRound;

    // If more than half the players rest each round, we can enforce longer gaps
    if (playersResting >= playerCount / 2) {
      return 2; // At least 2 matches between plays
    } else if (playersResting > 0) {
      return 1; // At least 1 match between plays
    } else {
      // Everyone plays every round - impossible to rest
      return 0;
    }
  }

  getMatchPlayers(match) {
    return [
      match.team1.player1,
      match.team1.player2,
      match.team2.player1,
      match.team2.player2
    ];
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

