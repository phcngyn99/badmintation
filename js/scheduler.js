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
    const usedMatchups = new Set(); // Track full matchups (e.g., "1-2-3-4")

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1 = teams[i];
        const team2 = teams[j];

        // Check if teams share a player
        if (this.teamsSharePlayer(team1, team2)) continue;

        // Create matchup key (all 4 players)
        const matchupKey = [
          team1.player1.id,
          team1.player2.id,
          team2.player1.id,
          team2.player2.id
        ].sort().join('-');

        // Skip if this exact matchup already exists
        if (usedMatchups.has(matchupKey)) continue;

        // Add the match
        matches.push({
          id: this.generateId(),
          team1,
          team2,
          team1Score: null,
          team2Score: null,
          status: 'pending',
          courtNumber: null
        });

        // Mark matchup as used
        usedMatchups.add(matchupKey);
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

    // Track how many times each player has played
    const playerMatchCount = new Map();
    this.players.forEach(p => playerMatchCount.set(p.id, 0));

    // Calculate minimum rest needed based on players and courts
    const minRestGap = this.calculateMinRestGap(this.players.length, courtCount);

    let currentRound = 0;

    while (remaining.length > 0) {
      // Try to schedule matches for this round
      // Maximum matches = min(courtCount, floor(playerCount / 4))
      const maxMatchesThisRound = Math.min(courtCount, Math.floor(this.players.length / 4));
      const roundMatches = [];
      const playersInRound = new Set();

      // Build candidate list with scoring
      const candidates = [];

      for (const match of remaining) {
        const matchPlayers = this.getMatchPlayers(match);
        const playerIds = matchPlayers.map(p => p.id);

        // Skip if any player already scheduled this round
        if (playerIds.some(id => playersInRound.has(id))) {
          continue;
        }

        // Calculate rest periods for all players
        const restPeriods = playerIds.map(id => currentRound - playerLastMatch.get(id));
        const minRest = Math.min(...restPeriods);
        const totalRest = restPeriods.reduce((a, b) => a + b, 0);

        // Calculate match counts for balancing
        const matchCounts = playerIds.map(id => playerMatchCount.get(id));
        const maxMatchCount = Math.max(...matchCounts);
        const totalMatchCount = matchCounts.reduce((a, b) => a + b, 0);

        // Score this match (higher is better)
        // Priority 1: Minimum rest (avoid back-to-back)
        // Priority 2: Total rest (spread matches out)
        // Priority 3: Balance match counts (players with fewer matches preferred)
        const score = {
          match,
          minRest,
          totalRest,
          maxMatchCount,
          totalMatchCount,
          playerIds
        };

        candidates.push(score);
      }

      // Sort candidates by priority
      candidates.sort((a, b) => {
        // First: prefer matches with better minimum rest
        if (b.minRest !== a.minRest) return b.minRest - a.minRest;
        // Second: prefer matches with higher total rest
        if (b.totalRest !== a.totalRest) return b.totalRest - a.totalRest;
        // Third: prefer matches with players who have played less
        if (a.maxMatchCount !== b.maxMatchCount) return a.maxMatchCount - b.maxMatchCount;
        if (a.totalMatchCount !== b.totalMatchCount) return a.totalMatchCount - b.totalMatchCount;
        return 0;
      });

      // Take the best match(es) for this round
      for (const candidate of candidates) {
        if (roundMatches.length >= maxMatchesThisRound) break;

        // Check if players are already in round
        if (candidate.playerIds.some(id => playersInRound.has(id))) continue;

        roundMatches.push(candidate.match);
        candidate.playerIds.forEach(id => playersInRound.add(id));
      }

      // If no matches found (shouldn't happen with the new algorithm), break
      if (roundMatches.length === 0) {
        // Add remaining matches in order
        optimized.push(...remaining);
        break;
      }

      // Add round matches to optimized list and update tracking
      roundMatches.forEach(match => {
        optimized.push(match);
        remaining.splice(remaining.indexOf(match), 1);

        // Update last match index and match count for all players in this match
        this.getMatchPlayers(match).forEach(player => {
          playerLastMatch.set(player.id, currentRound);
          playerMatchCount.set(player.id, playerMatchCount.get(player.id) + 1);
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

