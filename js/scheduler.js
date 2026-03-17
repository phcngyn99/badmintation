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
      // Round-Robin mode: optimized for 6 players
      if (this.players.length === 6) {
        return this.generateSixPlayerRoundRobin();
      }
      // Fallback for other counts
      return this.generateGenericRoundRobin(courtCount);
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

  generateGenericRoundRobin(courtCount) {
    // Placeholder for other player counts
    // For now, just return empty
    return [];
  }

  createRandomPairMatches(courtCount) {
    const targetMatchesPerPlayer = 7;
    const totalPlayerSlots = targetMatchesPerPlayer * this.players.length;
    const maxMatches = Math.min(Math.floor(totalPlayerSlots / 4), 30);
    
    const matches = [];
    
    for (let i = 0; i < maxMatches; i++) {
      const shuffled = [...this.players].sort(() => Math.random() - 0.5);
      
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

  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

