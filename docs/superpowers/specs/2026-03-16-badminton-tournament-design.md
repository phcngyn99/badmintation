# Badminton Tournament Manager - Design Specification

**Date:** 2026-03-16  
**Status:** Approved for Implementation

---

## Executive Summary

A mobile-first, single-page web application for managing badminton doubles tournaments with intelligent round-robin scheduling, player management, and comprehensive leaderboard tracking. Built with vanilla HTML/CSS/JavaScript using the High-Fidelity Claymorphism design system, deployable to Netlify as a static site.

---

## Goals

1. **Primary Goal:** Enable tournament organizers to manage badminton doubles tournaments on mobile devices with zero backend infrastructure
2. **User Experience:** Provide a playful, tactile, mobile-optimized interface that makes tournament management feel effortless
3. **Technical Goal:** Deliver a pure client-side application with intelligent match scheduling and real-time statistics

---

## User Requirements

### Functional Requirements

**Player Management:**
- Add players by name (minimum 4 required for doubles)
- Remove players (only before tournament starts)
- Visual roster display with player count

**Tournament Configuration:**
- Set number of courts (default: 2)
- One-click tournament start
- Session-based state (resets on page refresh)

**Match Scheduling:**
- Automatic round-robin doubles match generation
- **Maximum variety:** Each player partners with different people and faces different opponents
- **Smart rest scheduling:** System automatically spaces matches to maximize rest time between plays
- **Odd player handling:** Rotating bye system for odd-numbered player counts
- **Court optimization:** Distribute matches across available courts efficiently

**Match Management:**
- Display current matches on each court
- Score entry with validation (21-point rally scoring, win by 2)
- Match completion triggers next match assignment
- Visual indication of resting vs. active players

**Leaderboard & Statistics:**
- Real-time player rankings
- Track: Wins, Losses, Points Scored, Points Conceded, Win %, Matches Played
- Sortable by any metric
- Top 3 player highlighting

### Non-Functional Requirements

**Performance:**
- Page load < 2 seconds on 3G mobile
- Smooth 60fps animations on mid-range mobile devices
- Instant UI feedback on all interactions

**Accessibility:**
- Minimum 44px touch targets
- WCAG AA contrast ratios (maintained by design system)
- Keyboard navigation support
- Screen reader friendly labels

**Compatibility:**
- Modern mobile browsers (iOS Safari 14+, Chrome Android 90+)
- Tablet and desktop progressive enhancement
- No build tools or transpilation required

---

## Architecture

### Technology Stack

**Core:**
- HTML5 (semantic markup)
- CSS3 (custom properties, grid, flexbox, animations)
- Vanilla JavaScript ES6+ (modules, classes, async/await)

**Design System:**
- High-Fidelity Claymorphism
- Google Fonts: Nunito (headings), DM Sans (body)
- Mobile-first responsive design

**Deployment:**
- Netlify static hosting
- No backend, no database
- Client-side state management only

### System Components

**1. State Manager (`TournamentState`)**
- Manages players array
- Tracks current matches, completed matches, match queue
- Calculates and caches player statistics
- Provides state update notifications

**2. Match Scheduler (`MatchScheduler`)**
- Generates all possible unique team pairings
- Implements round-robin algorithm with variety maximization
- Optimizes match order for rest periods
- Assigns matches to courts in waves

**3. UI Controller (`UIController`)**
- Renders all UI sections
- Handles user interactions
- Updates DOM based on state changes
- Manages animations and transitions

**4. Statistics Calculator (`StatsCalculator`)**
- Computes player wins/losses
- Calculates points scored/conceded
- Determines win percentages
- Generates sortable leaderboard data

### Data Models

**Player:**
```javascript
{
  id: string,           // Unique identifier (UUID)
  name: string,         // Player name
  matchesPlayed: number,
  lastMatchIndex: number // For rest tracking
}
```

**Team:**
```javascript
{
  player1: Player,
  player2: Player
}
```

**Match:**
```javascript
{
  id: string,
  team1: Team,
  team2: Team,
  team1Score: number | null,
  team2Score: number | null,
  status: 'pending' | 'in-progress' | 'completed',
  courtNumber: number | null
}
```

**PlayerStats:**
```javascript
{
  player: Player,
  wins: number,
  losses: number,
  pointsScored: number,
  pointsConceded: number,
  winPercentage: number,
  matchesPlayed: number
}
```

---

## Match Scheduling Algorithm

### Round-Robin Doubles Strategy

**Phase 1: Team Generation**
1. Generate all possible unique pairs from player list
2. For N players, creates C(N,2) = N!/(2!(N-2)!) possible teams

**Phase 2: Match Creation**
1. For each unique team, find all valid opponent teams (no shared players)
2. Create match objects ensuring:
   - No team plays against same opponent twice
   - Each player plays roughly equal number of matches
3. Track pairings to maximize variety

**Phase 3: Rest Optimization**
1. Sort matches to maximize rest between each player's games
2. Algorithm:
   - Track `lastMatchIndex` for each player
   - When assigning next match, calculate rest score for each pending match
   - Rest score = sum of (currentIndex - lastMatchIndex) for all 4 players
   - Prioritize matches with highest rest score
3. Ensure minimum 1 match gap between plays when possible

**Phase 4: Court Assignment**
1. Assign matches to courts in waves
2. For 2 courts: matches 0-1 assigned to courts 1-2, matches 2-3 to courts 1-2, etc.
3. When court completes match, assign next match from queue
4. Visual indicator shows which players are currently resting

**Odd Player Handling:**
- When N is odd, one player sits out each match (rotating bye)
- Bye rotation ensures each player sits out equal number of times
- Sitting out counts as "rest" for scheduling purposes

---

## User Interface Design

### Mobile-First Layout (< 768px)

**Visual Hierarchy:**
1. Hero header (compact)
2. Player management OR court display (context-dependent)
3. Sticky bottom actions (Start Tournament / View Leaderboard)
4. Collapsible match queue
5. Hamburger menu for settings

**Section Breakdown:**

**1. Hero Header**
- Height: `h-32` (128px)
- Background: Canvas `#F4F1FA` with 2 animated blobs
- Title: `text-4xl font-black` with clay-text-gradient
- Subtitle: `text-sm text-clay-muted`
- Decorative: 1-2 floating clay orbs (shuttlecock/racket themed)

**2. Player Management Panel** (Pre-Tournament State)
- Container: Glass-clay card, `rounded-[24px] p-6`
- Input field: Recessed style, `h-14 rounded-2xl w-full`
- Add button: Full-width, emerald gradient, `h-14`
- Player roster: Single column grid, `gap-3`
- Player cards: `rounded-[20px] p-4` with name + remove button (icon)
- Start button: Sticky bottom, violet gradient, `h-16 w-full`

**3. Court Display** (Tournament Active State)
- Each court: Full-width card, `rounded-[32px] p-6`
- Court header: "Court 1" with status badge
- Team display:
  ```
  Team 1
  Player A + Player B

  VS (centered, muted)

  Team 2
  Player C + Player D
  ```
- Score inputs: Side-by-side, `h-12 w-20`, recessed style, numeric keyboard
- Complete button: Full-width, `h-14`, emerald gradient
- Empty court: "Waiting..." with breathing animation

**4. Match Queue** (Collapsible)
- Header: "Next Matches (3)" with chevron icon
- Collapsed: Shows count only
- Expanded: Vertical list of next 3-5 matches
- Match cards: Compact, `rounded-[20px] p-3 text-sm`
- Rest indicators: Color-coded badges (green = rested, amber = recently played)

**5. Leaderboard Modal**
- Trigger: Sticky tab at bottom, "View Leaderboard" with stats icon
- Modal: Full-screen overlay, glass-clay background with backdrop-blur
- Close: X button top-right + swipe-down gesture
- Table: Scrollable, simplified columns (Rank, Name, Wins, Win%)
- Sorting: Tap column headers to sort
- Top 3: Gradient borders (gold/silver/bronze)

**6. Settings Menu** (Hamburger)
- Trigger: Top-right icon
- Drawer: Slides in from right
- Options: Reset Tournament, About, Help

### Tablet Layout (768px - 1024px)

**Adaptations:**
- Courts: 2-column grid (both courts visible)
- Player management: Input + button in row, roster 2 columns
- Leaderboard: Inline section (not modal), more columns visible
- Match queue: Horizontal scrollable carousel
- Padding increases: `p-6` → `p-8`
- Border radii increase: `rounded-[24px]` → `rounded-[32px]`

### Desktop Layout (1024px+)

**Bento Grid:**
- Container: `max-w-7xl mx-auto`
- Courts: Horizontal row (all courts visible)
- Leaderboard: Large featured card, `col-span-2`
- Match queue: Horizontal carousel with visible overflow
- Player management: Compact panel in sidebar
- Full design system radii: `rounded-[32px]` to `rounded-[48px]`

---

## Interaction Design

### Mobile Touch Interactions

**Adding Players:**
1. Tap input → Keyboard appears (auto-focus)
2. Type name, press Enter or tap "Add Player"
3. Button squishes (`active:scale-[0.92]`)
4. Player card animates in with `clay-float` entrance
5. Input clears, keyboard remains open for next entry

**Starting Tournament:**
1. Button appears when 4+ players added (slides up from bottom)
2. Tap → Squish animation + haptic feedback simulation
3. Player panel fades out (300ms)
4. Court display fades in with staggered delays (courts, then queue, then leaderboard tab)
5. First matches auto-populate courts

**Completing Match:**
1. Tap score input → Numeric keyboard, enter score
2. Validation: Must reach 21, win by 2 (show error if invalid)
3. Tap "Complete Match" → Button squishes
4. Match card compresses with `shadow-clayPressed`
5. Scores save, leaderboard updates (number transitions)
6. Next match slides into court from bottom (400ms delay)
7. Auto-scroll to updated court

**Viewing Leaderboard:**
1. Tap sticky "View Leaderboard" tab
2. Modal slides up from bottom (500ms ease-out)
3. Backdrop blurs background
4. Tap column header → Sort animation (rows re-order with stagger)
5. Close: Tap X or swipe down → Modal slides down

**Navigating Courts:**
1. Swipe left/right on court cards (touch gesture)
2. Smooth scroll to next/previous court
3. Active court indicator (dots below courts)

### Animations

**Entrance Animations:**
- Player cards: `clay-float` with fade-in (300ms)
- Court cards: Staggered fade-in (200ms delay between)
- Leaderboard modal: Slide-up transform (500ms)

**Interaction Animations:**
- Button press: `scale-[0.92]` + `shadow-clayPressed` (200ms)
- Button hover (desktop): `hover:-translate-y-1` + enhanced shadow (300ms)
- Card hover (desktop): `hover:-translate-y-2` + enhanced shadow (500ms)

**Background Animations:**
- Blobs: `clay-float` and `clay-float-delayed` (8-12s loops)
- Decorative orbs: `clay-float-slow` (12s loop)
- Empty court: `clay-breathe` (6s loop)

**State Transitions:**
- Score updates: Number count-up animation (500ms)
- Leaderboard sort: Staggered row re-order (100ms delay per row)
- Match completion: Card compress (300ms) → Next match slide-in (400ms)

### Validation & Feedback

**Input Validation:**
- Player name: Required, min 2 characters, max 30 characters
- Score: Numeric only, 0-99 range
- Match completion: Both scores required, one team must reach 21, win by 2

**Error States:**
- Invalid input: Red border + shake animation
- Error message: Small text below input, red color
- Toast notification: Top-center, auto-dismiss after 3s

**Success States:**
- Player added: Green checkmark animation
- Match completed: Confetti burst (subtle, 1s duration)
- Tournament started: Success toast

---

## Design System Implementation

### Color Palette (Sporty Adaptation)

**Background:**
- Canvas: `#F4F1FA` (pale lavender-white)

**Foreground:**
- Primary text: `#332F3A` (soft charcoal)
- Muted text: `#635F69` (dark lavender-gray)

**Accents:**
- Primary (Emerald): `#10B981` - Add Player, Complete Match, Success states
- Secondary (Violet): `#7C3AED` - Start Tournament, Court cards, Active elements
- Tertiary (Sky Blue): `#0EA5E9` - Info, Resting players
- Warning (Amber): `#F59E0B` - Recently played players, Alerts
- Pink: `#DB2777` - Decorative gradients

**Gradients:**
- Emerald button: `from-[#6EE7B7] to-[#10B981]`
- Violet button: `from-[#A78BFA] to-[#7C3AED]`
- Text gradient: `from-clay-foreground 20%, to-[#10B981] 60%, to-[#7C3AED]`

**Background Blobs:**
- `bg-[#10B981]/10` (emerald)
- `bg-[#7C3AED]/10` (violet)
- `bg-[#0EA5E9]/10` (sky blue)

### Typography

**Fonts:**
- Headings: Nunito (weights: 700, 800, 900)
- Body: DM Sans (weights: 400, 500, 700)

**Mobile Scale:**
- Hero: `text-4xl font-black leading-[1.1]`
- Section titles: `text-2xl font-extrabold`
- Card titles: `text-lg font-bold`
- Body: `text-base font-medium leading-relaxed`
- Small: `text-sm font-medium`

**Tablet Scale:**
- Hero: `sm:text-5xl`
- Section titles: `sm:text-3xl`
- Card titles: `sm:text-xl`

**Desktop Scale:**
- Hero: `md:text-6xl lg:text-7xl`
- Section titles: `md:text-4xl`
- Card titles: `md:text-2xl`

### Shadows (4-Layer Stacks)

**Clay Card (Floating):**
```css
box-shadow:
  12px 12px 24px rgba(160, 150, 180, 0.15),
  -8px -8px 20px rgba(255, 255, 255, 0.9),
  inset 4px 4px 10px rgba(139, 92, 246, 0.03),
  inset -4px -4px 10px rgba(255, 255, 255, 1);
```

**Clay Button (Convex):**
```css
box-shadow:
  10px 10px 20px rgba(139, 92, 246, 0.25),
  -6px -6px 14px rgba(255, 255, 255, 0.4),
  inset 3px 3px 6px rgba(255, 255, 255, 0.4),
  inset -3px -3px 6px rgba(0, 0, 0, 0.1);
```

**Clay Pressed (Recessed):**
```css
box-shadow:
  inset 8px 8px 16px #d9d4e3,
  inset -8px -8px 16px #ffffff;
```

**Clay Button Hover (Enhanced):**
```css
box-shadow:
  14px 14px 28px rgba(139, 92, 246, 0.3),
  -8px -8px 18px rgba(255, 255, 255, 0.5),
  inset 4px 4px 8px rgba(255, 255, 255, 0.5),
  inset -4px -4px 8px rgba(0, 0, 0, 0.12);
```

### Border Radii

**Mobile:**
- Large containers: `rounded-[24px]`
- Cards: `rounded-[20px]`
- Buttons/Inputs: `rounded-2xl` (16px)
- Small elements: `rounded-xl` (12px)
- Orbs: `rounded-full`

**Desktop:**
- Large containers: `rounded-[48px]`
- Cards: `rounded-[32px]`
- Buttons/Inputs: `rounded-[20px]`
- Small elements: `rounded-2xl`

---

## File Structure

```
badminton-game/
├── index.html              # Main HTML file
├── css/
│   ├── design-system.css   # Clay design tokens & utilities
│   ├── components.css      # Component-specific styles
│   └── animations.css      # Keyframe animations
├── js/
│   ├── main.js            # App initialization
│   ├── state.js           # TournamentState class
│   ├── scheduler.js       # MatchScheduler class
│   ├── ui.js              # UIController class
│   └── stats.js           # StatsCalculator class
└── docs/
    └── superpowers/
        ├── specs/
        │   └── 2026-03-16-badminton-tournament-design.md
        └── plans/
            └── 2026-03-16-badminton-tournament.md
```

---

## Testing Strategy

### Manual Testing Checklist

**Player Management:**
- [ ] Add player with valid name
- [ ] Add player with empty name (should fail)
- [ ] Add player with very long name (should truncate or warn)
- [ ] Remove player before tournament starts
- [ ] Cannot remove player after tournament starts
- [ ] Start tournament with 4 players
- [ ] Start tournament with 5 players (odd number)
- [ ] Start tournament with 8 players
- [ ] Cannot start with < 4 players

**Match Scheduling:**
- [ ] Matches generated correctly for 4 players
- [ ] Matches generated correctly for 5 players (rotating bye)
- [ ] Matches generated correctly for 6+ players
- [ ] Each player partners with different people
- [ ] No duplicate matchups
- [ ] Rest periods optimized (players don't play consecutive matches when avoidable)

**Match Management:**
- [ ] Enter valid scores (21-19)
- [ ] Enter invalid scores (20-18) - should reject
- [ ] Enter scores requiring deuce (24-22) - should accept
- [ ] Complete match updates leaderboard
- [ ] Next match auto-populates court
- [ ] Both courts active when 2 courts configured

**Leaderboard:**
- [ ] Stats calculate correctly
- [ ] Sort by wins
- [ ] Sort by win percentage
- [ ] Sort by points scored
- [ ] Top 3 highlighted correctly

**Responsive:**
- [ ] Mobile layout (375px width)
- [ ] Tablet layout (768px width)
- [ ] Desktop layout (1280px width)
- [ ] Touch interactions work on mobile
- [ ] Swipe gestures work
- [ ] Keyboard navigation works on desktop

**Performance:**
- [ ] Page loads < 2s on 3G
- [ ] Animations smooth (60fps)
- [ ] No jank when scrolling
- [ ] Leaderboard modal opens smoothly

---

## Future Enhancements (Out of Scope)

- Export tournament results as PDF/CSV
- Save tournament state to localStorage (continue later)
- Multiple tournament management
- Custom scoring systems (11-point, 15-point)
- Team names instead of player pairs
- Tournament brackets (single/double elimination)
- Live scoring with QR code sharing
- PWA with offline support

---

## Success Criteria

1. **Functional:** Tournament organizer can manage a complete doubles tournament on mobile device without errors
2. **UX:** Users describe interface as "fun", "easy to use", "playful"
3. **Performance:** 60fps animations on iPhone 12 / Samsung Galaxy S21
4. **Accessibility:** Passes WCAG AA automated tests
5. **Deployment:** Successfully deploys to Netlify with zero configuration

---

## Approval

This design specification is approved for implementation.

**Next Steps:**
1. Create detailed implementation plan
2. Execute plan with TDD approach
3. Manual testing on multiple devices
4. Deploy to Netlify

