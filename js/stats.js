// js/stats.js

export class StatsCalculator {
  constructor(players, completedMatches) {
    this.players = players;
    this.completedMatches = completedMatches;
  }

  calculateLeaderboard() {
    return this.players.map(player => {
      const stats = this.calculatePlayerStats(player);
      return {
        player,
        ...stats
      };
    }).sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.winPercentage !== a.winPercentage) return b.winPercentage - a.winPercentage;
      return b.pointsScored - a.pointsScored;
    });
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

