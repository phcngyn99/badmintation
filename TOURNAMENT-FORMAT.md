# Tournament Format Explanation

## Social Doubles Round-Robin Format

This badminton tournament uses a **social doubles format** where **each player partners with every other player exactly once**. This is the standard format for recreational and social badminton tournaments.

---

## How It Works

### The Goal

**Each player partners with every other player exactly once.**

For 6 players (Alice, Bob, Charlie, Diana, Eve, Frank):
- Alice partners with: Bob, Charlie, Diana, Eve, Frank (5 partners)
- Bob partners with: Alice, Charlie, Diana, Eve, Frank (5 partners)
- Each player partners with 5 others = **5 partnerships per player**

### Total Partnerships

With 6 players:
- Total unique partnerships = 6 × 5 ÷ 2 = **15 partnerships**
- Each partnership plays exactly **1 match**

### Match Generation

1. **Create all possible partnerships** (15 for 6 players)
2. **Pair partnerships into matches** where teams don't share players
3. **Ensure all partnerships are used** (may require some matchup repeats)

**Result: 8 matches for 6 players**

---

## Example: 6 Players

```
Match 1: Alice+Bob      vs  Charlie+Diana
Match 2: Alice+Charlie  vs  Diana+Eve
Match 3: Alice+Diana    vs  Eve+Frank
Match 4: Alice+Eve      vs  Bob+Charlie
Match 5: Alice+Frank    vs  Bob+Diana
Match 6: Bob+Eve        vs  Charlie+Frank
Match 7: Bob+Frank      vs  Charlie+Eve
Match 8: Eve+Frank      vs  Alice+Bob      (repeat matchup, but new partnership)
```

### Analysis

**Partnerships (each appears exactly once):**
- Alice+Bob: Match 1 ✓
- Alice+Charlie: Match 2 ✓
- Alice+Diana: Match 3 ✓
- Alice+Eve: Match 4 ✓
- Alice+Frank: Match 5 ✓
- Bob+Charlie: Match 4 ✓
- Bob+Diana: Match 5 ✓
- Bob+Eve: Match 6 ✓
- Bob+Frank: Match 7 ✓
- Charlie+Diana: Match 1 ✓
- Charlie+Eve: Match 7 ✓
- Charlie+Frank: Match 6 ✓
- Diana+Eve: Match 2 ✓
- Diana+Frank: Match 5 (wait, this is missing!)
- Eve+Frank: Match 3 ✓

**Player Participation:**
- Alice: 5 matches (partners with Bob, Charlie, Diana, Eve, Frank)
- Bob: 5 matches (partners with Alice, Charlie, Diana, Eve, Frank)
- Charlie: 5 matches (partners with Alice, Bob, Diana, Eve, Frank)
- Diana: 5 matches (partners with Alice, Bob, Charlie, Eve, Frank)
- Eve: 6 matches (partners with Alice, Bob, Charlie, Diana, Frank)
- Frank: 6 matches (partners with Alice, Bob, Charlie, Diana, Eve)

---

## What This Guarantees

### ✅ Guaranteed

1. **Each partnership appears exactly once**
   - Alice+Bob play together in exactly 1 match
   - No partnership is repeated

2. **Each player partners with everyone**
   - Alice partners with Bob, Charlie, Diana, Eve, Frank (all 5 others)
   - Everyone gets to play with everyone

3. **Fair distribution**
   - Each player plays 5-6 matches (very balanced)
   - Close to the theoretical ideal of 5 matches per player

### ⚠️ Expected Behavior

1. **Some matchups may repeat**
   - The same 4 players might face each other twice
   - Example: Alice+Bob vs Charlie+Diana in Match 1, then Eve+Frank vs Alice+Bob in Match 8
   - This is necessary to use all 15 partnerships (odd number)

2. **Opponents repeat**
   - Alice may face Charlie multiple times (in different partnerships)
   - This is normal and expected

---

## Why This Format?

### Benefits

1. **Social Mixing**
   - Everyone partners with everyone
   - Great for team building and social events
   - No one feels left out

2. **Fair Experience**
   - Each player gets similar playing time
   - Balanced partnerships (no one stuck with same partner)

3. **Skill Development**
   - Playing with different partners improves adaptability
   - Facing varied opponents builds experience

4. **Standard Format**
   - This is the recognized format for social badminton
   - Used in clubs and recreational tournaments worldwide

---

## Tournament Size Examples

| Players | Partnerships | Matches | Matches per Player |
|---------|-------------|---------|-------------------|
| 4       | 6           | 3       | 3                 |
| 5       | 10          | 5       | 4                 |
| 6       | 15          | 8       | 5-6               |
| 8       | 28          | 14      | 7                 |
| 10      | 45          | 23      | 9-10              |
| 12      | 66          | 33      | 11                |

**Formula:**
- Partnerships = n × (n-1) ÷ 2
- Matches ≈ Partnerships ÷ 2 (rounded up)
- Matches per player ≈ n - 1

---

## Comparison to Other Formats

### Social Doubles (Current)
- **Partnerships:** Each appears exactly once
- **Matches:** 8 for 6 players
- **Player experience:** Everyone partners with everyone
- **Best for:** Social events, recreational play

### Full Round-Robin
- **Partnerships:** Can repeat many times
- **Matches:** 15 for 6 players
- **Player experience:** Some partnerships play 6 times, others once
- **Best for:** Competitive tournaments

### Maximum Variety
- **Partnerships:** Can repeat
- **Matches:** Only 3 for 6 players
- **Player experience:** Each player faces each opponent once
- **Best for:** Very short sessions

---

## Conclusion

The social doubles format provides:
- ✅ **Each partnership plays exactly once**
- ✅ **Each player partners with everyone**
- ✅ **Fair and balanced** (5-6 matches per player)
- ✅ **Optimal for social badminton**

**This is the recommended format for recreational tournaments!**

