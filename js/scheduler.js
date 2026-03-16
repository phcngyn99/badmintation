// js/scheduler.js

export class MatchScheduler {
  constructor(players) {
    this.players = players;
    this.matches = [];
  }

  generateMatches(courtCount = 2) {
    // Use social doubles format: each player partners with each other player exactly once
    const matches = this.createSocialDoublesMatches();
    const optimizedMatches = this.optimizeForRest(matches, courtCount);
    return optimizedMatches;
  }

  createSocialDoublesMatches() {
    // Generate all possible partnerships
    const allPartnerships = [];
    for (let i = 0; i < this.players.length; i++) {
      for (let j = i + 1; j < this.players.length; j++) {
        allPartnerships.push({
          player1: this.players[i],
          player2: this.players[j],
          key: `${this.players[i].id}-${this.players[j].id}`,
          playerIds: [this.players[i].id, this.players[j].id]
        });
      }
    }

    // Create matches using greedy matching to maximize partnership usage
    const matches = [];
    const usedPartnerships = new Set();
    const usedMatchups = new Set();

    // Keep trying to create matches until we can't anymore
    let attempts = 0;
    const maxAttempts = allPartnerships.length * 2;

    while (usedPartnerships.size < allPartnerships.length && attempts < maxAttempts) {
      attempts++;

      // Find first unused partnership
      let team1 = null;
      for (const p of allPartnerships) {
        if (!usedPartnerships.has(p.key)) {
          team1 = p;
          break;
        }
      }

      if (!team1) break;

      // Find a compatible opponent team (unused partnership, no shared players)
      let team2 = null;
      for (const p of allPartnerships) {
        if (usedPartnerships.has(p.key)) continue;
        if (p.key === team1.key) continue;

        // Check if teams share a player
        const sharesPlayer = team1.playerIds.some(id => p.playerIds.includes(id));
        if (sharesPlayer) continue;

        // Check if this matchup already exists
        const matchupKey = [...team1.playerIds, ...p.playerIds].sort().join('-');
        if (usedMatchups.has(matchupKey)) continue;

        team2 = p;
        break;
      }

      if (team2) {
        // Create the match
        const matchupKey = [...team1.playerIds, ...team2.playerIds].sort().join('-');

        matches.push({
          id: this.generateId(),
          team1: { player1: team1.player1, player2: team1.player2 },
          team2: { player1: team2.player1, player2: team2.player2 },
          team1Score: null,
          team2Score: null,
          status: 'pending',
          courtNumber: null
        });

        usedPartnerships.add(team1.key);
        usedPartnerships.add(team2.key);
        usedMatchups.add(matchupKey);
      }
    }

    // Handle remaining unused partnerships by creating additional matches
    // Try to pair unused partnerships together first, then allow repeats if needed
    for (const p1 of allPartnerships) {
      if (usedPartnerships.has(p1.key)) continue;

      // First, try to find another unused partnership
      let team2 = null;
      for (const p2 of allPartnerships) {
        if (usedPartnerships.has(p2.key)) continue; // Prefer unused
        if (p1.key === p2.key) continue;

        const sharesPlayer = p1.playerIds.some(id => p2.playerIds.includes(id));
        if (sharesPlayer) continue;

        team2 = p2;
        break;
      }

      // If no unused partnership found, find any compatible opponent
      if (!team2) {
        for (const p2 of allPartnerships) {
          if (p1.key === p2.key) continue;

          const sharesPlayer = p1.playerIds.some(id => p2.playerIds.includes(id));
          if (sharesPlayer) continue;

          team2 = p2;
          break;
        }
      }

      if (team2) {
        matches.push({
          id: this.generateId(),
          team1: { player1: p1.player1, player2: p1.player2 },
          team2: { player1: team2.player1, player2: team2.player2 },
          team1Score: null,
          team2Score: null,
          status: 'pending',
          courtNumber: null
        });

        usedPartnerships.add(p1.key);
        if (!usedPartnerships.has(team2.key)) {
          usedPartnerships.add(team2.key);
        }
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

