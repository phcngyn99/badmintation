// js/scheduler.js

export class MatchScheduler {
  constructor(players, mode = 'balanced') {
    this.players = players;
    this.matches = [];
    this.mode = mode; // 'balanced' or 'random'
  }

  generateMatches(courtCount = 2) {
    if (this.mode === 'random') {
      return this.createRandomPairMatches(courtCount);
    } else {
      // Round-Robin mode with health-aware scheduling:
      // - Balanced team fatigue (equal rest between teams)
      // - Optimized rest periods between matches
      // - Everyone partners with everyone (all partnerships)
      // - Only the last few matches may be unbalanced
      const matches = this.createSocialDoublesMatches();
      const optimizedMatches = this.optimizeForRest(matches, courtCount);

      return optimizedMatches;
    }
  }

  calculateTargetMatches() {
    const playerCount = this.players.length;

    // For 6 players: 7 matches means each player plays 4-5 matches
    // For 8 players: 10 matches means each player plays 5 matches
    // General formula: aim for each player to play ~5 matches
    const targetMatchesPerPlayer = 5;
    const totalPlayerSlots = targetMatchesPerPlayer * playerCount;
    const targetMatches = Math.floor(totalPlayerSlots / 4); // 4 players per match

    return Math.max(7, Math.min(targetMatches, 15)); // Between 7-15 matches
  }

  createRandomPairMatches(courtCount) {
    // Generate random pairs for each match
    // Calculate dynamic match count based on player count
    const targetMatchesPerPlayer = 7;
    const totalPlayerSlots = targetMatchesPerPlayer * this.players.length;
    const maxMatches = Math.min(Math.floor(totalPlayerSlots / 4), 30); // Cap at 30

    const matches = [];

    for (let i = 0; i < maxMatches; i++) {
      const shuffled = [...this.players].sort(() => Math.random() - 0.5);

      // Take first 4 players for this match
      if (shuffled.length < 4) break;

      const match = {
        id: this.generateId(),
        team1: {
          player1: shuffled[0],
          player2: shuffled[1]
        },
        team2: {
          player1: shuffled[2],
          player2: shuffled[3]
        },
        team1Score: null,
        team2Score: null,
        status: 'pending',
        courtNumber: null
      };

      matches.push(match);
    }

    return matches;
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

    // Health-aware scheduling: consider player fatigue and partnership separation
    const matches = [];
    const usedPartnerships = new Set();
    const playerLastMatch = new Map();
    this.players.forEach(p => playerLastMatch.set(p.id, -1));

    let matchIndex = 0;

    // Calculate max matches: try to use ALL partnerships
    const targetPartnerships = allPartnerships.length;

    while (usedPartnerships.size < targetPartnerships && matchIndex < 30) {
      // Count how many times each player has been used
      const playerUsageCount = new Map();
      this.players.forEach(p => playerUsageCount.set(p.id, 0));
      usedPartnerships.forEach(key => {
        const [p1, p2] = key.split('-');
        playerUsageCount.set(p1, playerUsageCount.get(p1) + 1);
        playerUsageCount.set(p2, playerUsageCount.get(p2) + 1);
      });

      // Find best team1 (prefer well-rested players, avoid overusing same players)
      let bestTeam1 = null;
      let bestTeam1Score = -Infinity;

      for (const p of allPartnerships) {
        if (usedPartnerships.has(p.key)) continue;

        // Calculate rest: how many matches since last played
        const lastMatch1 = playerLastMatch.get(p.player1.id);
        const lastMatch2 = playerLastMatch.get(p.player2.id);
        const rest1 = lastMatch1 === -1 ? Infinity : matchIndex - lastMatch1;
        const rest2 = lastMatch2 === -1 ? Infinity : matchIndex - lastMatch2;
        const usage1 = playerUsageCount.get(p.player1.id);
        const usage2 = playerUsageCount.get(p.player2.id);

        // Score: prefer high rest AND low usage (balance player participation)
        let score = (rest1 + rest2) * 100 - (usage1 + usage2) * 50;

        if (score > bestTeam1Score) {
          bestTeam1Score = score;
          bestTeam1 = p;
        }
      }

      if (!bestTeam1) break;

      // Find best team2 (MUST have balanced fatigue with team1)
      let bestTeam2 = null;
      let bestTeam2Score = -Infinity;

      // Calculate team1's player states (fresh or played)
      const team1Last1 = playerLastMatch.get(bestTeam1.player1.id);
      const team1Last2 = playerLastMatch.get(bestTeam1.player2.id);
      const team1Rest1 = team1Last1 === -1 ? Infinity : matchIndex - team1Last1;
      const team1Rest2 = team1Last2 === -1 ? Infinity : matchIndex - team1Last2;

      // Count fresh vs played players in team1
      const team1FreshCount = (team1Last1 === -1 ? 1 : 0) + (team1Last2 === -1 ? 1 : 0);
      const team1TotalRest = team1Rest1 + team1Rest2;

      for (const p of allPartnerships) {
        if (usedPartnerships.has(p.key)) continue;
        if (p.key === bestTeam1.key) continue;

        // Must not share players
        const sharesPlayer = bestTeam1.playerIds.some(id => p.playerIds.includes(id));
        if (sharesPlayer) continue;

        // Calculate rest for this team
        const team2Last1 = playerLastMatch.get(p.player1.id);
        const team2Last2 = playerLastMatch.get(p.player2.id);
        const rest1 = team2Last1 === -1 ? Infinity : matchIndex - team2Last1;
        const rest2 = team2Last2 === -1 ? Infinity : matchIndex - team2Last2;

        // Count fresh vs played players in team2
        const team2FreshCount = (team2Last1 === -1 ? 1 : 0) + (team2Last2 === -1 ? 1 : 0);
        const team2TotalRest = rest1 + rest2;

        // CRITICAL: Balance means same fresh/played composition
        // 2 fresh vs 2 fresh, 1f+1p vs 1f+1p, 2p vs 2p
        const freshDifference = Math.abs(team1FreshCount - team2FreshCount);

        // Also consider total rest balance
        const restDifference = Math.abs(team1TotalRest - team2TotalRest);

        // Score based on balanced fresh/played composition (highest priority)
        let score = 100000 - freshDifference * 50000; // HUGE penalty for fresh imbalance
        score -= restDifference * 1000; // Secondary: total rest balance

        // Bonus for perfect match
        if (freshDifference === 0 && restDifference === 0) {
          score += 100000; // PERFECT BALANCE!
        }

        if (score > bestTeam2Score) {
          bestTeam2Score = score;
          bestTeam2 = p;
        }
      }

      // If no team found with strict criteria, relax and find any compatible team
      if (!bestTeam2) {
        for (const p of allPartnerships) {
          if (usedPartnerships.has(p.key)) continue;
          if (p.key === bestTeam1.key) continue;

          const sharesPlayer = bestTeam1.playerIds.some(id => p.playerIds.includes(id));
          if (sharesPlayer) continue;

          bestTeam2 = p;
          break;
        }
      }

      // Special case: if this is the last unused partnership and we can't find a match,
      // allow reusing a partnership to ensure all partnerships are used
      if (!bestTeam2 && usedPartnerships.size === allPartnerships.length - 1) {
        const lastUnused = allPartnerships.find(p => !usedPartnerships.has(p.key));
        if (lastUnused) {
          // Find ANY compatible opponent, even if already used
          for (const p of allPartnerships) {
            if (p.key === lastUnused.key) continue;

            const sharesPlayer = lastUnused.playerIds.some(id => p.playerIds.includes(id));
            if (sharesPlayer) continue;

            bestTeam1 = lastUnused;
            bestTeam2 = p;
            break;
          }
        }
      }

      if (!bestTeam2) break;

      // Double-check that neither partnership has been used (safety check)
      // EXCEPT for the last match where we allow one reuse to complete all partnerships
      const isLastPartnership = usedPartnerships.size === allPartnerships.length - 1;
      if (!isLastPartnership) {
        if (usedPartnerships.has(bestTeam1.key)) {
          console.error('ERROR: bestTeam1 partnership already used!', bestTeam1.key);
          break;
        }
        if (usedPartnerships.has(bestTeam2.key)) {
          console.error('ERROR: bestTeam2 partnership already used!', bestTeam2.key);
          break;
        }
      }

      // Calculate health balance for this match (reuse variables from team selection)
      const team2Last1Final = playerLastMatch.get(bestTeam2.player1.id);
      const team2Last2Final = playerLastMatch.get(bestTeam2.player2.id);

      const team1FreshCountFinal = (team1Last1 === -1 ? 1 : 0) + (team1Last2 === -1 ? 1 : 0);
      const team2FreshCountFinal = (team2Last1Final === -1 ? 1 : 0) + (team2Last2Final === -1 ? 1 : 0);
      const freshImbalance = Math.abs(team1FreshCountFinal - team2FreshCountFinal);

      // Calculate rest for display
      const team1Rest1Str = team1Last1 === -1 ? 'Fresh' : `${matchIndex - team1Last1} rest`;
      const team1Rest2Str = team1Last2 === -1 ? 'Fresh' : `${matchIndex - team1Last2} rest`;
      const team2Rest1Str = team2Last1Final === -1 ? 'Fresh' : `${matchIndex - team2Last1Final} rest`;
      const team2Rest2Str = team2Last2Final === -1 ? 'Fresh' : `${matchIndex - team2Last2Final} rest`;

      // Create the match
      matches.push({
        id: this.generateId(),
        team1: { player1: bestTeam1.player1, player2: bestTeam1.player2 },
        team2: { player1: bestTeam2.player1, player2: bestTeam2.player2 },
        team1Score: null,
        team2Score: null,
        status: 'pending',
        courtNumber: null,
        healthWarning: freshImbalance > 0,
        isOptional: false, // Will be marked later
        restInfo: {
          team1: [team1Rest1Str, team1Rest2Str],
          team2: [team2Rest1Str, team2Rest2Str]
        }
      });

      // Update tracking
      usedPartnerships.add(bestTeam1.key);
      usedPartnerships.add(bestTeam2.key);

      [bestTeam1, bestTeam2].forEach(team => {
        playerLastMatch.set(team.player1.id, matchIndex);
        playerLastMatch.set(team.player2.id, matchIndex);
      });

      matchIndex++;
    }

    // Mark last matches with health warnings as optional
    // Find the last match without health warning
    let lastHealthyMatchIndex = -1;
    for (let i = matches.length - 1; i >= 0; i--) {
      if (!matches[i].healthWarning) {
        lastHealthyMatchIndex = i;
        break;
      }
    }

    // Mark matches after the last healthy match as optional
    if (lastHealthyMatchIndex >= 0 && lastHealthyMatchIndex < matches.length - 1) {
      for (let i = lastHealthyMatchIndex + 1; i < matches.length; i++) {
        matches[i].isOptional = true;
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

