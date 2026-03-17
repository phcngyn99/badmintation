// js/stats.js

export class StatsCalculator {
  constructor(players, completedMatches, mode = 'balanced') {
    this.players = players;
    this.completedMatches = completedMatches;
    this.mode = mode;
  }

  calculateLeaderboard() {
    if (this.mode === 'random') {
      return this.calculatePairLeaderboard();
    }

    const playerCount = this.players.length;
    // Use win percentage for 6 & 7 (unequal matches), points for 8 & 9 (equal matches)
    const useWinPercentage = playerCount === 6 || playerCount === 7;

    return this.players.map(player => {
      const stats = this.calculatePlayerStats(player);
      return {
        player,
        ...stats
      };
    }).sort((a, b) => {
      if (useWinPercentage) {
        // For 6 & 7 players: Sort by win percentage first
        if (b.winPercentage !== a.winPercentage) return b.winPercentage - a.winPercentage;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.pointsScored - a.pointsScored;
      } else {
        // For 8 players: Sort by wins (points) first
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.winPercentage !== a.winPercentage) return b.winPercentage - a.winPercentage;
        return b.pointsScored - a.pointsScored;
      }
    });
  }

  calculatePairLeaderboard() {
    // In random mode, track statistics for each pair
    const pairStats = new Map();

    for (const match of this.completedMatches) {
      // Team 1 pair
      const team1Key = this.getPairKey(match.team1.player1, match.team1.player2);
      const team1Won = match.team1Score > match.team2Score;

      if (!pairStats.has(team1Key)) {
        pairStats.set(team1Key, {
          player1: match.team1.player1,
          player2: match.team1.player2,
          wins: 0,
          losses: 0,
          pointsScored: 0,
          pointsConceded: 0,
          matchesPlayed: 0
        });
      }

      const team1Stats = pairStats.get(team1Key);
      team1Stats.matchesPlayed++;
      team1Stats.pointsScored += match.team1Score;
      team1Stats.pointsConceded += match.team2Score;
      if (team1Won) team1Stats.wins++;
      else team1Stats.losses++;

      // Team 2 pair
      const team2Key = this.getPairKey(match.team2.player1, match.team2.player2);
      const team2Won = match.team2Score > match.team1Score;

      if (!pairStats.has(team2Key)) {
        pairStats.set(team2Key, {
          player1: match.team2.player1,
          player2: match.team2.player2,
          wins: 0,
          losses: 0,
          pointsScored: 0,
          pointsConceded: 0,
          matchesPlayed: 0
        });
      }

      const team2Stats = pairStats.get(team2Key);
      team2Stats.matchesPlayed++;
      team2Stats.pointsScored += match.team2Score;
      team2Stats.pointsConceded += match.team1Score;
      if (team2Won) team2Stats.wins++;
      else team2Stats.losses++;
    }

    // Convert to array and calculate win percentage
    return Array.from(pairStats.values()).map(stats => {
      const winPercentage = stats.matchesPlayed > 0
        ? (stats.wins / stats.matchesPlayed) * 100
        : 0;
      return {
        ...stats,
        winPercentage: Math.round(winPercentage)
      };
    }).sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.winPercentage !== a.winPercentage) return b.winPercentage - a.winPercentage;
      return b.pointsScored - a.pointsScored;
    });
  }

  getPairKey(player1, player2) {
    // Create consistent key regardless of order
    const ids = [player1.id, player2.id].sort();
    return ids.join('-');
  }

  calculatePlayerStats(player) {
    let wins = 0;
    let losses = 0;
    let pointsScored = 0;
    let pointsConceded = 0;

    for (const match of this.completedMatches) {
      const isTeam1 = match.team1.player1.id === player.id || match.team1.player2.id === player.id;
      const isTeam2 = match.team2.player1.id === player.id || match.team2.player2.id === player.id;

      if (!isTeam1 && !isTeam2) continue;

      if (isTeam1) {
        pointsScored += match.team1Score;
        pointsConceded += match.team2Score;
        if (match.team1Score > match.team2Score) wins++;
        else losses++;
      } else {
        pointsScored += match.team2Score;
        pointsConceded += match.team1Score;
        if (match.team2Score > match.team1Score) wins++;
        else losses++;
      }
    }

    const matchesPlayed = wins + losses;
    const winPercentage = matchesPlayed > 0 ? (wins / matchesPlayed) * 100 : 0;

    return {
      wins,
      losses,
      pointsScored,
      pointsConceded,
      winPercentage: Math.round(winPercentage),
      matchesPlayed
    };
  }
}

