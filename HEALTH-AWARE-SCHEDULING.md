# Health-Aware Scheduling Algorithm

## Overview

The tournament uses a **health-aware scheduling algorithm** that considers player fatigue and ensures fair distribution of rest periods. This prevents players from being overworked and creates balanced, competitive matches.

---

## Key Principles

### 1. Player Health First

**Problem:** In naive scheduling, some players might play many consecutive matches while others rest, leading to:
- Physical exhaustion
- Unfair competitive advantage (tired vs. fresh players)
- Poor player experience

**Solution:** The algorithm tracks when each player last played and prioritizes rest.

### 2. Balanced Team Fatigue

**Problem:** If both players in a team just finished playing, they face a team of two rested players - unfair!

**Solution:** Each team should ideally have:
- **1 player who just played** (tired)
- **1 player who rested** (fresh)

This creates balanced, competitive matches.

### 3. Partnership Separation

**Problem:** If Alice and Bob partner in Match 1, they shouldn't partner again in Match 2 (no rest between partnerships).

**Solution:** Players who just partnered together are separated in the next match.

---

## How It Works

### Example: 6 Players (Alice, Bob, Charlie, Diana, Eve, Frank)

**Match 1: Alice+Bob vs Charlie+Diana**
- Playing: Alice, Bob, Charlie, Diana
- Resting: Eve, Frank

**Match 2: Alice+Eve vs Bob+Frank**
- Alice (just played) + Eve (rested) = Balanced team
- Bob (just played) + Frank (rested) = Balanced team
- Charlie, Diana rest (they just played)
- Alice and Bob are separated (they just partnered)

**Match 3: Charlie+Diana vs Eve+Frank**
- Charlie (rested 1 match) + Diana (rested 1 match)
- Eve (just played) + Frank (just played)
- Alice, Bob rest (they've played 2 consecutive matches)

This pattern continues, ensuring:
- ✅ No player plays too many consecutive matches
- ✅ Teams are balanced (tired + fresh players)
- ✅ Recent partners are separated

---

## Algorithm Details

### Step 1: Select Team 1

Find the partnership with the **highest total rest**:
- Calculate rest for each player: `currentMatch - lastMatchPlayed`
- Sum rest for both players in partnership
- Choose partnership with highest sum

**Example:**
- Alice (rest: 2) + Bob (rest: 1) = Total rest: 3
- Charlie (rest: 0) + Diana (rest: 0) = Total rest: 0
- **Choose Alice+Bob** (more rested)

### Step 2: Select Team 2 (Opponent)

Find the best opponent partnership considering:

1. **Must not share players** with Team 1
2. **Prefer balanced fatigue:**
   - One player with rest = 0 (just played)
   - One player with rest ≥ 1 (rested)
   - Bonus score: +100 for balanced teams

3. **Total rest** as tiebreaker

**Example:**
- Team 1: Alice+Bob
- Candidates:
  - Charlie (rest: 0) + Eve (rest: 2) = Balanced! Score: 102
  - Diana (rest: 0) + Frank (rest: 2) = Balanced! Score: 102
  - Charlie (rest: 0) + Diana (rest: 0) = Not balanced. Score: 0
- **Choose Charlie+Eve** (balanced team)

### Step 3: Update Tracking

After creating the match:
- Mark both partnerships as used
- Update `lastMatchPlayed` for all 4 players
- Move to next match

---

## Benefits

### 1. Fair Physical Load

All players get similar amounts of rest between matches:
- No player plays 5 consecutive matches
- Rest periods are distributed evenly
- Prevents exhaustion

### 2. Competitive Balance

Teams are evenly matched in terms of fatigue:
- Both teams have 1 tired + 1 fresh player
- No unfair advantage from rest differences
- Better quality matches

### 3. Social Mixing

Players still partner with everyone:
- Each partnership appears exactly once
- Maximum variety in partners and opponents
- Great for social events

### 4. Health Safety

Reduces injury risk:
- Players get adequate rest
- Prevents overexertion
- Sustainable for longer tournaments

---

## Comparison to Other Algorithms

### Naive (Random Order)
- ❌ Some players play 5+ consecutive matches
- ❌ Unbalanced teams (2 tired vs 2 fresh)
- ❌ Poor player experience

### Simple Round-Robin
- ❌ No consideration for fatigue
- ❌ Recent partners may play together again
- ❌ Unfair competitive balance

### Health-Aware (Current)
- ✅ Balanced rest distribution
- ✅ Balanced team fatigue
- ✅ Partnership separation
- ✅ Fair and sustainable

---

## Real-World Impact

### For 6 Players

**Without health-aware scheduling:**
- Alice might play matches 1, 2, 3, 4, 5 consecutively
- Match 5: Alice (exhausted) + Bob (exhausted) vs Charlie (fresh) + Diana (fresh)
- Unfair and unsafe

**With health-aware scheduling:**
- Alice plays matches 1, 2, (rest), 4, (rest), 6
- Each match has balanced teams
- Fair and safe for all players

### For Larger Tournaments

With 12 players:
- Even more important to manage fatigue
- Algorithm ensures no one plays more than 2-3 consecutive matches
- Creates sustainable tournament experience

---

## Technical Implementation

The algorithm is implemented in `js/scheduler.js`:

```javascript
// Track when each player last played
const playerLastMatch = new Map();

// For each match:
// 1. Find best-rested partnership for Team 1
// 2. Find balanced opponent for Team 2
// 3. Update tracking
```

The scheduling happens in two phases:
1. **Match generation** (health-aware) - Creates the match list
2. **Match optimization** (rest-aware) - Orders matches for optimal rest

Both work together to create the best possible tournament experience!

---

## Conclusion

The health-aware scheduling algorithm ensures:
- ✅ **Fair physical load** - No player overworked
- ✅ **Balanced competition** - Teams evenly matched
- ✅ **Partnership variety** - Everyone partners with everyone
- ✅ **Player safety** - Adequate rest prevents injury

**This creates the best possible tournament experience for all players!**

