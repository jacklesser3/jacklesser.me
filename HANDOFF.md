# Draft War Room - Handoff Documentation

## Current State
- **Location:** `/Users/jacklesser/jacklesser.me/`
- **Dev Server:** Running at http://127.0.0.1:3000/draft
- **Framework:** Next.js 16 with TypeScript
- **Status:** UI complete, needs real player data

## Critical Issue
**Only 50 real player names in database. Need 300 real players with 2026 projections.**

## File Structure

### App Files (src/app/draft/)
```
page.tsx                    # Route definition
draft-war-room.tsx         # Main application component
lib/
  types.ts                  # TypeScript interfaces
  scoring.ts                # Z-score value algorithm (HR 2x, K/9 2x)
  draft-state.ts            # localStorage draft tracking
components/
  PlayerTable.tsx           # Sortable player list
  DraftStrategy.tsx         # Round-by-round targets
  RecommendationPanel.tsx   # AI pick suggestions
  RosterTracker.tsx         # User's current roster
  DraftBoard.tsx            # 12x23 draft grid
```

### Scripts (scripts/)
```
scrape-projections.ts       # ⚠️ NEEDS FIXING - Replace with real data source
generate-full-rankings.ts   # Generates 300 players (currently placeholders)
generate-draft-guide.ts     # Creates CSV cheat sheet
```

### Data Files (public/data/)
```
players-2026.json          # ⚠️ MAIN DATA FILE - Only has 50 real players
belters-cheat-sheet.csv    # Manual target list (has real names)
belters-targets.md         # Detailed strategy guide
```

## What Works
- ✅ Complete UI with all components
- ✅ Draft state persistence (localStorage)
- ✅ Value scoring algorithm
- ✅ Snake draft logic (picks 12, 13, 36, 37, etc.)
- ✅ 24 keepers properly excluded
- ✅ Manual strategy guide with real player names

## What's Broken
- ❌ `players-2026.json` has placeholders "Player 175", "Pitcher 228"
- ❌ No real 2026 stat projections
- ❌ CBS Sports rankings page can't be scraped (JavaScript-rendered)

## How to Fix

### Option 1: Use FantasyPros API/Export
FantasyPros has consensus rankings that might be scrapable or exportable.

### Option 2: Steamer/ZiPS Projections
Public projection systems available at:
- FanGraphs.com (has CSV export)
- Baseball Prospectus

### Option 3: Manual Entry
Copy top 200 from CBS Sports manually and format as JSON.

### Option 4: Use Existing Manual List
The file `belters-cheat-sheet.csv` already has real player names for all rounds. Could convert this to the full JSON format.

## Required JSON Format

```json
{
  "id": "kyle-tucker",
  "name": "Kyle Tucker",
  "team": "CHC",
  "positions": ["OF"],
  "batting": {
    "r": 100,
    "hr": 35,
    "rbi": 105,
    "sb": 20,
    "avg": 0.285,
    "ops": 0.900
  },
  "pitching": null,
  "adp": 12,
  "isKept": false
}
```

## Keeper List (24 players to mark isKept: true)
Mason Miller, Roman Anthony, Junior Caminero, Bryan Woo, Jac Caglianone, Nolan McLean, Shea Langeliers, Kevin Gausman, Jackson Chourio, Nick Kurtz, William Contreras, Freddy Peralta, Zach Neto, Eury Perez, Hunter Brown, Jacob Wilson, Paul Skenes, Spencer Strider, Garrett Crochet, Jeremy Peña, Jarren Duran, Hunter Goodman, Colton Montgomery, Jacob Misiorowski

## Running the App

```bash
cd /Users/jacklesser/jacklesser.me
npm run dev
# Opens at http://127.0.0.1:3000/draft
```

## Regenerating Data

Once you have real player data:

```bash
# Update players-2026.json with real data
# Then regenerate the draft guide CSV:
npx tsx scripts/generate-draft-guide.ts

# Output: public/data/belters-draft-guide.csv
```

## User's Requirements

1. **300 real players** with actual 2026 projections
2. **Round-by-round targets** showing who's available at picks 12, 13, 36, 37, etc.
3. **CSV format** for easy reference during draft (TONIGHT at 8pm EDT)
4. **10-15 player options per round** in later rounds
5. **Full stats** (HR, R, RBI, SB, AVG for hitters / ERA, WHIP, K/9, SV for pitchers)

## Timeline
**URGENT:** Draft is TONIGHT (March 23, 2026 @ 8pm EDT)

Need completed CSV with real players ASAP.

## Contact
User: jacklesser
Project: /Users/jacklesser/jacklesser.me/
