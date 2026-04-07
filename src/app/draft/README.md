# Fantasy Baseball Draft War Room

A smart draft assistant for the 2026 fantasy baseball season.

## Features

- **Smart Rankings**: Z-score based value algorithm that weights HR (2x) and K/9 (2x) categories
- **Position Scarcity**: Automatically adjusts value for scarce positions (C, SS)
- **AI Recommendations**: Top 5 picks tailored to your roster needs and draft position
- **Live Draft Tracking**: 12-team snake draft board with real-time updates
- **Roster Management**: Track position needs and drafted players
- **Persistent State**: Draft progress saved to localStorage

## Usage

1. **Navigate to `/draft`** to open the war room
2. **Enter picks** as the draft progresses by clicking "Draft" on any player
3. **Follow recommendations** in the right panel for optimal picks
4. **Track your roster** to see position needs
5. **Undo mistakes** with the "Undo Last Pick" button

## League Configuration

- **Teams**: 12
- **Rounds**: 23
- **Your Pick Position**: 12th (snake draft)
- **Keepers**: 24 players already kept (marked as unavailable)

### Your Keepers
- Junior Caminero
- Bryan Woo

## Technical Details

### Value Scoring Algorithm

Players are scored using Z-scores across all categories:

**Batting Categories** (6):
- R, HR (2x weight), RBI, SB, AVG, OPS

**Pitching Categories** (6):
- ERA, WHIP, K/9 (2x weight), QS, NSV, W

**Position Adjustments**:
- C: 1.15x multiplier
- SS: 1.10x multiplier
- 2B/3B: 1.05x multiplier
- OF: 0.95x multiplier

### Recommendation Logic

1. **Position Needs**: Prioritizes filling unfilled roster spots
2. **Scarcity**: Values C and SS higher when far from next pick (20+ picks away)
3. **Best Available**: Recommends highest-value player when roster is balanced
4. **Category Focus**: Highlights players strong in HR or K/9

### Data Source

- Player projections: 2026 consensus rankings (currently mock data)
- Stats: Projected season totals for all 12 categories
- ADP: Average draft position for reference

## Future Enhancements

- Connect to FantasyPros API for live projections
- CSV export of draft recap
- Trade analyzer
- Weekly lineup optimizer
- Yahoo/ESPN API integration

## Files

- `draft-war-room.tsx` - Main application component
- `lib/scoring.ts` - Value calculation algorithm
- `lib/draft-state.ts` - Draft state management with localStorage
- `lib/types.ts` - TypeScript interfaces
- `components/` - UI components (PlayerTable, RecommendationPanel, etc.)
- `/public/data/players-2026.json` - Player database (75 players + 24 keepers)

## Notes

- All state persists in localStorage - refresh safe
- Keepers are filtered from available players
- Reset button clears entire draft (use with caution)
- Works offline once page is loaded
