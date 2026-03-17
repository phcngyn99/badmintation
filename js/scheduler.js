// js/scheduler-new.js - Optimized Round-Robin for 6 players

export class MatchScheduler {
  constructor(players, mode = 'balanced') {
    this.players = players;
    this.matches = [];
    this.mode = mode;
  }

  generateMatches(courtCount = 2) {
    if (this.mode === 'random') {
      return this.createRandomPairMatches(courtCount);
    } else {
      // Round-Robin mode: optimized schedules for 6, 7, 8, 9 players
      if (this.players.length === 6) {
        return this.generateSixPlayerRoundRobin();
      } else if (this.players.length === 7) {
        return this.generateSevenPlayerRoundRobin();
      } else if (this.players.length === 8) {
        return this.generateEightPlayerRoundRobin();
      } else if (this.players.length === 9) {
        return this.generateNinePlayerRoundRobin();
      }
      // For other counts, return empty (not supported)
      return [];
    }
  }

  generateSixPlayerRoundRobin() {
    // Optimal schedule for 6 players: 8 matches
    // Each player plays 5-6 matches
    // All 15 partnerships used (partnership 1-2 used twice)
    // Health-aware: 2F vs 2F, 1F+1P vs 1F+1P, 2P vs 2P

    const p = this.players;

    const schedule = [
      // Match 1: 2F vs 2F
      { team1: [0, 1], team2: [2, 3] },
      // Match 2: 1F+1P vs 1F+1P
      { team1: [0, 4], team2: [1, 5] },
      // Match 3: 2P vs 2P
      { team1: [2, 4], team2: [3, 5] },
      // Match 4: 2P vs 2P
      { team1: [0, 2], team2: [1, 3] },
      // Match 5: 2P vs 2P
      { team1: [0, 5], team2: [1, 4] },
      // Match 6: 2P vs 2P
      { team1: [2, 5], team2: [3, 4] },
      // Match 7: 2P vs 2P
      { team1: [0, 3], team2: [1, 2] },
      // Match 8: 2P vs 2P (partnership 0-1 repeats)
      { team1: [4, 5], team2: [0, 1] }
    ];

    const matches = [];
    const playerLastMatch = new Map();
    this.players.forEach(player => playerLastMatch.set(player.id, -1));

    schedule.forEach((matchDef, matchIndex) => {
      const team1Player1 = p[matchDef.team1[0]];
      const team1Player2 = p[matchDef.team1[1]];
      const team2Player1 = p[matchDef.team2[0]];
      const team2Player2 = p[matchDef.team2[1]];

      // Calculate health info
      const team1Last1 = playerLastMatch.get(team1Player1.id);
      const team1Last2 = playerLastMatch.get(team1Player2.id);
      const team2Last1 = playerLastMatch.get(team2Player1.id);
      const team2Last2 = playerLastMatch.get(team2Player2.id);

      const team1FreshCount = (team1Last1 === -1 ? 1 : 0) + (team1Last2 === -1 ? 1 : 0);
      const team2FreshCount = (team2Last1 === -1 ? 1 : 0) + (team2Last2 === -1 ? 1 : 0);
      const freshImbalance = Math.abs(team1FreshCount - team2FreshCount);

      const team1Rest1Str = team1Last1 === -1 ? 'Fresh' : `${matchIndex - team1Last1} rest`;
      const team1Rest2Str = team1Last2 === -1 ? 'Fresh' : `${matchIndex - team1Last2} rest`;
      const team2Rest1Str = team2Last1 === -1 ? 'Fresh' : `${matchIndex - team2Last1} rest`;
      const team2Rest2Str = team2Last2 === -1 ? 'Fresh' : `${matchIndex - team2Last2} rest`;

      matches.push({
        id: this.generateId(),
        team1: { player1: team1Player1, player2: team1Player2 },
        team2: { player1: team2Player1, player2: team2Player2 },
        team1Score: null,
        team2Score: null,
        status: 'pending',
        courtNumber: null,
        healthWarning: freshImbalance > 0,
        isOptional: false,
        restInfo: {
          team1: [team1Rest1Str, team1Rest2Str],
          team2: [team2Rest1Str, team2Rest2Str]
        }
      });

      // Update last match for all players
      playerLastMatch.set(team1Player1.id, matchIndex);
      playerLastMatch.set(team1Player2.id, matchIndex);
      playerLastMatch.set(team2Player1.id, matchIndex);
      playerLastMatch.set(team2Player2.id, matchIndex);
    });

    return matches;
  }

  generateSevenPlayerRoundRobin() {
    // 7 players: 11 matches, max 2 consecutive matches per player
    // 20/21 partnerships covered (1 partnership missing)
    const p = this.players;

    const schedule = [
      // Match 1: 2F vs 2F
      { team1: [0, 1], team2: [2, 3] },
      // Match 2: 1F+1P vs 1F+1P
      { team1: [4, 5], team2: [6, 0] },
      // Match 3: 1F+1P vs 1F+1P
      { team1: [1, 2], team2: [3, 4] },
      // Match 4: 2P vs 2P
      { team1: [5, 6], team2: [0, 2] },
      // Match 5: 2P vs 2P
      { team1: [1, 3], team2: [4, 6] },
      // Match 6: 2P vs 2P
      { team1: [0, 5], team2: [2, 4] },
      // Match 7: 2P vs 2P
      { team1: [1, 6], team2: [3, 5] },
      // Match 8: 2P vs 2P
      { team1: [0, 4], team2: [2, 6] },
      // Match 9: 2P vs 2P
      { team1: [1, 5], team2: [3, 0] },
      // Match 10: 2P vs 2P
      { team1: [2, 5], team2: [4, 1] },
      // Match 11: 2P vs 2P
      { team1: [0, 6], team2: [3, 4] }
    ];

    return this.buildMatchesFromSchedule(schedule);
  }

  generateEightPlayerRoundRobin() {
    // 8 players: 14 matches, all 28 partnerships covered exactly once
    // Each player plays exactly 7 matches (perfect balance!)
    const p = this.players;

    const schedule = [
      // Match 1: 2F vs 2F
      { team1: [0, 1], team2: [2, 3] },
      // Match 2: 2F vs 2F
      { team1: [4, 5], team2: [6, 7] },
      // Match 3: 1F+1P vs 1F+1P
      { team1: [0, 4], team2: [1, 5] },
      // Match 4: 1F+1P vs 1F+1P
      { team1: [2, 6], team2: [3, 7] },
      // Match 5: 2P vs 2P
      { team1: [0, 2], team2: [1, 3] },
      // Match 6: 2P vs 2P
      { team1: [4, 6], team2: [5, 7] },
      // Match 7: 2P vs 2P
      { team1: [0, 6], team2: [1, 7] },
      // Match 8: 2P vs 2P
      { team1: [2, 4], team2: [3, 5] },
      // Match 9: 2P vs 2P
      { team1: [0, 5], team2: [2, 7] },
      // Match 10: 2P vs 2P
      { team1: [1, 4], team2: [3, 6] },
      // Match 11: 2P vs 2P
      { team1: [0, 7], team2: [1, 6] },
      // Match 12: 2P vs 2P
      { team1: [2, 5], team2: [3, 4] },
      // Match 13: 2P vs 2P
      { team1: [0, 3], team2: [5, 6] },
      // Match 14: 2P vs 2P
      { team1: [1, 2], team2: [4, 7] }
    ];

    return this.buildMatchesFromSchedule(schedule);
  }

  generateNinePlayerRoundRobin() {
    // 9 players: 18 matches, all 36 partnerships covered exactly once
    // Each player plays exactly 8 matches (perfect balance!)
    const p = this.players;

    const schedule = [
      // Match 1: 2F vs 2F
      { team1: [0, 1], team2: [2, 3] },
      // Match 2: 2F vs 2F
      { team1: [4, 5], team2: [6, 7] },
      // Match 3: 1F+1P vs 1F+1P
      { team1: [0, 8], team2: [1, 2] },
      // Match 4: 1F+1P vs 1F+1P
      { team1: [3, 4], team2: [5, 6] },
      // Match 5: 2P vs 2P
      { team1: [0, 7], team2: [2, 8] },
      // Match 6: 2P vs 2P
      { team1: [1, 3], team2: [4, 6] },
      // Match 7: 2P vs 2P
      { team1: [0, 5], team2: [7, 8] },
      // Match 8: 2P vs 2P
      { team1: [1, 4], team2: [2, 6] },
      // Match 9: 2P vs 2P
      { team1: [0, 3], team2: [5, 8] },
      // Match 10: 2P vs 2P
      { team1: [1, 6], team2: [4, 7] },
      // Match 11: 2P vs 2P
      { team1: [0, 2], team2: [3, 8] },
      // Match 12: 2P vs 2P
      { team1: [1, 5], team2: [6, 8] },
      // Match 13: 2P vs 2P
      { team1: [0, 4], team2: [2, 7] },
      // Match 14: 2P vs 2P
      { team1: [1, 7], team2: [3, 5] },
      // Match 15: 2P vs 2P
      { team1: [0, 6], team2: [4, 8] },
      // Match 16: 2P vs 2P
      { team1: [2, 5], team2: [3, 7] },
      // Match 17: 2P vs 2P
      { team1: [1, 8], team2: [2, 4] },
      // Match 18: 2P vs 2P
      { team1: [3, 6], team2: [5, 7] }
    ];

    return this.buildMatchesFromSchedule(schedule);
  }

  buildMatchesFromSchedule(schedule) {
    const matches = [];
    const playerLastMatch = new Map();
    this.players.forEach(player => playerLastMatch.set(player.id, -1));

    schedule.forEach((matchDef, matchIndex) => {
      const team1Player1 = this.players[matchDef.team1[0]];
      const team1Player2 = this.players[matchDef.team1[1]];
      const team2Player1 = this.players[matchDef.team2[0]];
      const team2Player2 = this.players[matchDef.team2[1]];

      const team1Last1 = playerLastMatch.get(team1Player1.id);
      const team1Last2 = playerLastMatch.get(team1Player2.id);
      const team2Last1 = playerLastMatch.get(team2Player1.id);
      const team2Last2 = playerLastMatch.get(team2Player2.id);

      const team1FreshCount = (team1Last1 === -1 ? 1 : 0) + (team1Last2 === -1 ? 1 : 0);
      const team2FreshCount = (team2Last1 === -1 ? 1 : 0) + (team2Last2 === -1 ? 1 : 0);
      const freshImbalance = Math.abs(team1FreshCount - team2FreshCount);

      const team1Rest1Str = team1Last1 === -1 ? 'Fresh' : `${matchIndex - team1Last1} rest`;
      const team1Rest2Str = team1Last2 === -1 ? 'Fresh' : `${matchIndex - team1Last2} rest`;
      const team2Rest1Str = team2Last1 === -1 ? 'Fresh' : `${matchIndex - team2Last1} rest`;
      const team2Rest2Str = team2Last2 === -1 ? 'Fresh' : `${matchIndex - team2Last2} rest`;

      matches.push({
        id: this.generateId(),
        team1: { player1: team1Player1, player2: team1Player2 },
        team2: { player1: team2Player1, player2: team2Player2 },
        team1Score: null,
        team2Score: null,
        status: 'pending',
        courtNumber: null,
        healthWarning: freshImbalance > 0,
        isOptional: false,
        restInfo: {
          team1: [team1Rest1Str, team1Rest2Str],
          team2: [team2Rest1Str, team2Rest2Str]
        }
      });

      playerLastMatch.set(team1Player1.id, matchIndex);
      playerLastMatch.set(team1Player2.id, matchIndex);
      playerLastMatch.set(team2Player1.id, matchIndex);
      playerLastMatch.set(team2Player2.id, matchIndex);
    });

    return matches;
  }

  createRandomPairMatches(courtCount) {
    // Random Pairs mode:
    // 1. Create fixed pairs once (random)
    // 2. Calculate optimal courts (max 6, target ~4 hours)
    // 3. Schedule matches with health-aware algorithm
    // 4. Each pair plays against every other pair (round-robin for pairs)

    if (this.players.length < 4) return [];
    if (this.players.length > 16) {
      console.warn('Random Pairs mode supports max 16 players');
      return [];
    }

    // Step 1: Create random pairs
    const shuffledPlayers = [...this.players].sort(() => Math.random() - 0.5);
    const pairs = [];

    for (let i = 0; i < shuffledPlayers.length - 1; i += 2) {
      pairs.push({
        id: `pair-${i/2}`,
        player1: shuffledPlayers[i],
        player2: shuffledPlayers[i + 1],
        name: `${shuffledPlayers[i].name}-${shuffledPlayers[i + 1].name}`
      });
    }

    // If odd number of players, last player sits out
    if (shuffledPlayers.length % 2 === 1) {
      console.log(`Player ${shuffledPlayers[shuffledPlayers.length - 1].name} sits out (odd number)`);
    }

    // Step 2: Calculate optimal courts
    // Target: ~3 hours (12 rounds max at 15 min/round)
    // Formula: courts = ceil(total_matches / 12) but max 6
    const totalMatches = pairs.length * (pairs.length - 1) / 2;
    const targetRounds = 12; // ~3 hours
    const optimalCourts = Math.ceil(totalMatches / targetRounds);
    const courts = Math.min(6, Math.max(1, optimalCourts));

    console.log(`Random Pairs: ${pairs.length} pairs, ${totalMatches} matches, using ${courts} courts`);

    // Step 3: Generate all possible matchups (each pair vs every other pair)
    const allMatchups = [];
    for (let i = 0; i < pairs.length; i++) {
      for (let j = i + 1; j < pairs.length; j++) {
        allMatchups.push({
          pair1: pairs[i],
          pair2: pairs[j]
        });
      }
    }

    // Step 4: Schedule with health-aware algorithm
    return this.scheduleRandomPairsMatches(allMatchups, pairs, courts);
  }

  scheduleRandomPairsMatches(allMatchups, pairs, courts) {
    // Multi-court scheduling with strict consecutive prevention
    const matches = [];
    const usedMatchups = new Set();
    const pairLastRound = new Map();
    const pairMatchCount = new Map();
    pairs.forEach(p => {
      pairLastRound.set(p.id, -1);
      pairMatchCount.set(p.id, 0);
    });

    let roundIndex = 0;

    while (usedMatchups.size < allMatchups.length && roundIndex < 100) {
      const roundMatches = [];
      const pairsPlayingThisRound = new Set();

      // Calculate max courts for this round based on available pairs
      const availablePairs = pairs.filter(p => pairLastRound.get(p.id) !== roundIndex - 1);
      const maxCourtsThisRound = Math.min(courts, Math.floor(availablePairs.length / 2));

      // Try to fill courts
      while (roundMatches.length < maxCourtsThisRound) {
        let bestMatchup = null;
        let bestScore = -Infinity;
        for (const matchup of allMatchups) {
          const key = `${matchup.pair1.id}-${matchup.pair2.id}`;
          if (usedMatchups.has(key)) continue;

          // Skip if either pair is already playing this round
          if (pairsPlayingThisRound.has(matchup.pair1.id) ||
              pairsPlayingThisRound.has(matchup.pair2.id)) {
            continue;
          }

          const pair1Last = pairLastRound.get(matchup.pair1.id);
          const pair2Last = pairLastRound.get(matchup.pair2.id);

          // Skip if either pair just played in previous round (would be consecutive)
          if (pair1Last === roundIndex - 1 || pair2Last === roundIndex - 1) {
            continue;
          }

          const pair1Rest = pair1Last === -1 ? Infinity : roundIndex - pair1Last;
          const pair2Rest = pair2Last === -1 ? Infinity : roundIndex - pair2Last;

          const pair1Fresh = pair1Last === -1 ? 1 : 0;
          const pair2Fresh = pair2Last === -1 ? 1 : 0;
          const freshBalance = Math.abs(pair1Fresh - pair2Fresh);

          const pair1Count = pairMatchCount.get(matchup.pair1.id);
          const pair2Count = pairMatchCount.get(matchup.pair2.id);
          const countBalance = Math.abs(pair1Count - pair2Count);

          // Score: Prioritize 1) Health balance, 2) Equal match distribution, 3) Rest time
          const score = -freshBalance * 100000 - countBalance * 1000 + (pair1Rest + pair2Rest) * 10;

          if (score > bestScore) {
            bestScore = score;
            bestMatchup = matchup;
          }
        }

        // NEVER relax consecutive constraint - strict enforcement
        if (!bestMatchup) break; // No more matches can be added to this round

        // Add match to this round
        const pair1Last = pairLastRound.get(bestMatchup.pair1.id);
        const pair2Last = pairLastRound.get(bestMatchup.pair2.id);

        const pair1FreshCount = pair1Last === -1 ? 1 : 0;
        const pair2FreshCount = pair2Last === -1 ? 1 : 0;
        const freshImbalance = Math.abs(pair1FreshCount - pair2FreshCount);

        const pair1RestStr = pair1Last === -1 ? 'Fresh' : `${roundIndex - pair1Last} rest`;
        const pair2RestStr = pair2Last === -1 ? 'Fresh' : `${roundIndex - pair2Last} rest`;

        roundMatches.push({
          id: this.generateId(),
          team1: {
            player1: bestMatchup.pair1.player1,
            player2: bestMatchup.pair1.player2
          },
          team2: {
            player1: bestMatchup.pair2.player1,
            player2: bestMatchup.pair2.player2
          },
          team1Score: null,
          team2Score: null,
          status: 'pending',
          courtNumber: null,
          healthWarning: freshImbalance > 0,
          isOptional: false,
          restInfo: {
            team1: [pair1RestStr, pair1RestStr],
            team2: [pair2RestStr, pair2RestStr]
          },
          // Store pair info for scoring
          pair1Id: bestMatchup.pair1.id,
          pair2Id: bestMatchup.pair2.id
        });

        usedMatchups.add(`${bestMatchup.pair1.id}-${bestMatchup.pair2.id}`);
        pairsPlayingThisRound.add(bestMatchup.pair1.id);
        pairsPlayingThisRound.add(bestMatchup.pair2.id);
        pairMatchCount.set(bestMatchup.pair1.id, pairMatchCount.get(bestMatchup.pair1.id) + 1);
        pairMatchCount.set(bestMatchup.pair2.id, pairMatchCount.get(bestMatchup.pair2.id) + 1);
      }

      // Update last round for all pairs that played
      pairsPlayingThisRound.forEach(pairId => {
        pairLastRound.set(pairId, roundIndex);
      });

      // Add all matches from this round
      matches.push(...roundMatches);

      roundIndex++;
    }

    return matches;
  }

  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

