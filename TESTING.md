# Testing Checklist

## Automated Tests

### Logic Tests (Completed ✓)
- [x] Player creation
- [x] Team generation (10 teams from 5 players)
- [x] Match generation (15 valid matches)
- [x] Score validation (21-point rally scoring)
- [x] Statistics calculation (wins, losses, points)

**Result:** All logic tests passed successfully!

## Manual Testing Guide

### 1. Initial Load
- [ ] Open `index.html` in browser
- [ ] Verify background blobs are animated
- [ ] Verify gradient title displays correctly
- [ ] Check browser console for errors (should be none)

### 2. Player Management
- [ ] Add a player with valid name (2+ characters)
- [ ] Try to add player with empty name (should show error)
- [ ] Add 3 more players (total 4)
- [ ] Verify "Tournament Setup" section appears
- [ ] Remove a player
- [ ] Verify "Tournament Setup" section disappears
- [ ] Add player back to reach 4 again

### 3. Tournament Start
- [ ] Set court count to 2
- [ ] Click "Start Tournament"
- [ ] Verify player management section hides
- [ ] Verify court display appears
- [ ] Verify 2 courts are shown
- [ ] Verify matches are assigned to courts
- [ ] Verify "Next Matches" section appears
- [ ] Verify "View Leaderboard" button appears at bottom

### 4. Match Completion
- [ ] Enter valid scores (e.g., 21-19)
- [ ] Click "Complete Match"
- [ ] Verify next match appears on court
- [ ] Try invalid scores (e.g., 20-18) - should show error
- [ ] Try scores without win by 2 (e.g., 21-20) - should show error
- [ ] Enter valid deuce score (e.g., 24-22) - should work

### 5. Match Queue
- [ ] Click "Next Matches" to expand
- [ ] Verify upcoming matches are listed
- [ ] Verify count updates as matches complete
- [ ] Click again to collapse

### 6. Leaderboard
- [ ] Click "View Leaderboard" button
- [ ] Verify modal slides up from bottom
- [ ] Verify all players are listed
- [ ] Verify stats are calculated correctly
- [ ] Verify top 3 have colored badges
- [ ] Click X to close modal
- [ ] Click backdrop to close modal

### 7. Responsive Design

**Mobile (375px):**
- [ ] Player input is full width
- [ ] Buttons are full width
- [ ] Courts stack vertically
- [ ] Leaderboard modal slides from bottom
- [ ] All touch targets are at least 44px

**Tablet (768px):**
- [ ] Courts display in 2-column grid
- [ ] Player input and button in row
- [ ] Leaderboard shows all columns

**Desktop (1280px):**
- [ ] Container has max-width
- [ ] Hover effects work on buttons
- [ ] All features accessible

### 8. Edge Cases
- [ ] Test with 4 players (minimum)
- [ ] Test with 5 players (odd number - rotating bye)
- [ ] Test with 8 players (larger tournament)
- [ ] Complete all matches in a tournament
- [ ] Verify final leaderboard is accurate

## Browser Compatibility

Test in:
- [ ] Chrome/Edge (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Android

## Performance

- [ ] Page loads in < 2 seconds
- [ ] Animations are smooth (60fps)
- [ ] No jank when scrolling
- [ ] Modal opens/closes smoothly

## Deployment Test

- [ ] Deploy to Netlify
- [ ] Verify site loads correctly
- [ ] Test full tournament flow on deployed site
- [ ] Test on actual mobile device

## Known Limitations

- Tournament state resets on page refresh (by design)
- No localStorage persistence (by design)
- Maximum 4 courts supported
- No export functionality (future enhancement)

