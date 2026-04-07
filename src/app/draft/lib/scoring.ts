// Z-score based player valuation algorithm

import { Player, ScoredPlayer } from "./types";

// Category weights (HR and K/9 are 2x)
const CATEGORY_WEIGHTS: Record<string, number> = {
  // Batting
  r: 1,
  hr: 2,    // KEY STAT
  rbi: 1,
  sb: 1,
  avg: 1,
  ops: 1,
  // Pitching
  era: 1,   // Lower is better
  whip: 1,  // Lower is better
  k9: 2,    // KEY STAT
  qs: 1,
  nsv: 1,
  w: 1,
};

// Position scarcity multipliers
const POSITION_SCARCITY: Record<string, number> = {
  C: 1.15,
  SS: 1.10,
  "2B": 1.05,
  "3B": 1.05,
  "1B": 1.0,
  OF: 0.95,
  SP: 1.0,
  RP: 1.0,
  P: 1.0,
  DH: 0.9,
  Util: 1.0,
};

interface StatSummary {
  mean: number;
  stdDev: number;
}

function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function calculateStdDev(values: number[], mean: number): number {
  if (values.length === 0) return 1;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance) || 1; // Avoid division by zero
}

function getStatSummary(players: Player[], stat: string, isBatting: boolean): StatSummary {
  const values = players
    .filter(p => isBatting ? p.batting !== null : p.pitching !== null)
    .map(p => {
      if (isBatting && p.batting) {
        return p.batting[stat as keyof typeof p.batting] as number;
      } else if (!isBatting && p.pitching) {
        return p.pitching[stat as keyof typeof p.pitching] as number;
      }
      return 0;
    })
    .filter(v => v !== null && v !== undefined && !isNaN(v));

  const mean = calculateMean(values);
  const stdDev = calculateStdDev(values, mean);

  return { mean, stdDev };
}

function calculateZScore(value: number, summary: StatSummary, isNegativeStat = false): number {
  if (summary.stdDev === 0) return 0;
  const zScore = (value - summary.mean) / summary.stdDev;
  // For ERA and WHIP, lower is better, so invert the Z-score
  return isNegativeStat ? -zScore : zScore;
}

export function calculatePlayerValues(players: Player[]): ScoredPlayer[] {
  // Filter out kept players
  const availablePlayers = players.filter(p => !p.isKept);

  // Calculate stat summaries for all categories
  const battingStats = ["r", "hr", "rbi", "sb", "avg", "ops"];
  const pitchingStats = ["era", "whip", "k9", "qs", "nsv", "w"];

  const battingSummaries: Record<string, StatSummary> = {};
  const pitchingSummaries: Record<string, StatSummary> = {};

  battingStats.forEach(stat => {
    battingSummaries[stat] = getStatSummary(availablePlayers, stat, true);
  });

  pitchingStats.forEach(stat => {
    pitchingSummaries[stat] = getStatSummary(availablePlayers, stat, false);
  });

  // Calculate Z-scores and composite values for each player
  const scoredPlayers: ScoredPlayer[] = availablePlayers.map(player => {
    const categoryScores: Record<string, number> = {};
    let totalValue = 0;

    if (player.batting) {
      battingStats.forEach(stat => {
        const value = player.batting![stat as keyof typeof player.batting] as number;
        const isNegative = false; // No negative batting stats
        const zScore = calculateZScore(value, battingSummaries[stat], isNegative);
        const weight = CATEGORY_WEIGHTS[stat] || 1;
        categoryScores[stat] = zScore;
        totalValue += zScore * weight;
      });
    }

    if (player.pitching) {
      pitchingStats.forEach(stat => {
        const value = player.pitching![stat as keyof typeof player.pitching] as number;
        const isNegative = stat === "era" || stat === "whip"; // Lower is better
        const zScore = calculateZScore(value, pitchingSummaries[stat], isNegative);
        const weight = CATEGORY_WEIGHTS[stat] || 1;
        categoryScores[stat] = zScore;
        totalValue += zScore * weight;
      });
    }

    // Apply position scarcity multiplier
    const primaryPosition = player.positions[0] || "Util";
    const scarcityMultiplier = POSITION_SCARCITY[primaryPosition] || 1.0;
    totalValue *= scarcityMultiplier;

    return {
      ...player,
      value: totalValue,
      categoryScores,
    };
  });

  // Sort by value descending
  return scoredPlayers.sort((a, b) => b.value - a.value);
}

export function getPositionScarcityMultiplier(positions: string[]): number {
  if (positions.length === 0) return 1.0;
  // Use the highest scarcity multiplier from eligible positions
  return Math.max(...positions.map(pos => POSITION_SCARCITY[pos] || 1.0));
}
