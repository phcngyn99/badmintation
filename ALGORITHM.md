# Smart Match Scheduling Algorithm

## Overview

The badminton tournament uses an intelligent round-robin scheduling algorithm that dynamically adapts to the number of players and available courts to ensure fair rest distribution.

## Key Features

### 1. Dynamic Rest Calculation

The algorithm calculates the minimum rest gap based on actual tournament conditions:

```javascript
maxMatchesPerRound = min(courtCount, floor(playerCount / 4))
playersPerRound = maxMatchesPerRound × 4
playersResting = playerCount - playersPerRound

if (playersResting >= playerCount / 2):
    minRestGap = 2  // At least 2 matches between plays
else if (playersResting > 0):
    minRestGap = 1  // At least 1 match between plays
else:
    minRestGap = 0  // Everyone plays every round
```

### 2. Examples

**6 Players, 2 Courts:**
- Max matches per round: 1 (only 4 players available, need 8 for 2 courts)
- Players per round: 4
- Players resting: 2
- Min rest gap: 1 match

**8 Players, 2 Courts:**
- Max matches per round: 2 (8 players available, exactly enough for 2 courts)
- Players per round: 8
- Players resting: 0
- Min rest gap: 0 (everyone plays every round)

**10 Players, 2 Courts:**
- Max matches per round: 2
- Players per round: 8
- Players resting: 2
- Min rest gap: 1 match

**12 Players, 2 Courts:**
- Max matches per round: 2
- Players per round: 8
- Players resting: 4
- Min rest gap: 1 match

**16 Players, 2 Courts:**
- Max matches per round: 2
- Players per round: 8
- Players resting: 8 (half the players)
- Min rest gap: 2 matches

### 3. Match Selection Priority

For each round, the algorithm:

1. **First Priority:** Find matches where ALL 4 players have rested > minRestGap
2. **Second Priority:** If no matches satisfy strict rest, find the match with:
   - Highest minimum rest (ensure no player plays back-to-back if possible)
   - Highest total rest score (sum of all 4 players' rest periods)

### 4. Round-Robin Variety

The algorithm ensures:
- Each player partners with as many different people as possible
- Each player faces as many different opponents as possible
- No duplicate matchups (same 4 players in same teams)

## Algorithm Flow

```
1. Generate all possible team pairings
2. Create all valid matches (no shared players between teams)
3. For each round:
   a. Try to schedule up to maxMatchesPerRound
   b. Find matches where all players have rested enough
   c. If none found, select match with best rest scores
   d. Update player last-match tracking
4. Repeat until all matches scheduled
```

## Benefits

- **Fair Rest:** Players get breaks proportional to tournament size
- **No Back-to-Back:** Algorithm actively avoids consecutive matches
- **Court Optimization:** Uses all available courts when possible
- **Scalable:** Works with any number of players (4+) and courts (1-4)
- **Adaptive:** Automatically adjusts rest requirements based on conditions

## Testing

With 6 players and 2 courts:
- Average rest: 0.4-0.6 matches between plays
- Minimum rest: 0-1 matches (some back-to-back unavoidable with high utilization)
- Much better than naive scheduling which would have players playing 5-6 consecutive matches

## Future Improvements

- Add configurable rest preferences (strict vs. relaxed)
- Implement "fatigue tracking" to prioritize resting players who've played more
- Add court preference/rotation for fairness
- Support for skill-based balancing

