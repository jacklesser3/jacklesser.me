// TypeScript interfaces for Fantasy Baseball Draft War Room

export interface Player {
  id: string;              // "judge-aaron"
  name: string;            // "Aaron Judge"
  team: string;            // "NYY"
  positions: string[];     // ["OF", "DH"]

  batting: {
    r: number;
    hr: number;            // KEY STAT (2x weight)
    rbi: number;
    sb: number;
    avg: number;
    ops: number;
  } | null;

  pitching: {
    era: number;
    whip: number;
    k9: number;            // KEY STAT (2x weight)
    qs: number;
    nsv: number;
    w: number;
  } | null;

  adp: number;             // Average draft position
  isKept: boolean;         // true for 24 keeper players
  keeperOwner?: string;    // "Jack Lesser"
}

export interface ScoredPlayer extends Player {
  value: number;           // Composite Z-score value
  categoryScores: {        // Individual category Z-scores
    [key: string]: number;
  };
}

export interface DraftPick {
  pickNumber: number;      // 1-276
  round: number;           // 1-23
  teamNumber: number;      // 1-12
  playerId: string;
  playerName: string;
  timestamp: number;
}

export interface DraftState {
  picks: DraftPick[];
  currentPickNumber: number;
  currentTeam: number;
  userTeamNumber: number;  // 12 (picking last)
}

export interface RosterSlots {
  C: number;      // 1
  "1B": number;   // 1
  "2B": number;   // 1
  "3B": number;   // 1
  SS: number;     // 1
  OF: number;     // 3
  Util: number;   // 2 (any hitter)
  SP: number;     // 1
  RP: number;     // 1
  P: number;      // 6 (any pitcher)
  BN: number;     // 6 (bench)
  IL: number;     // 2 (injured list)
  NA: number;     // 0 (not active)
}
