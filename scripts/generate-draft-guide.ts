import { writeFileSync, readFileSync } from "node:fs";
import path from "node:path";

interface Player {
  id: string;
  name: string;
  team: string;
  positions: string[];
  batting: {
    r: number;
    hr: number;
    rbi: number;
    sb: number;
    avg: number;
    ops: number;
  } | null;
  pitching: {
    era: number;
    whip: number;
    k9: number;
    qs: number;
    nsv: number;
    w: number;
  } | null;
  adp: number;
  isKept: boolean;
}

const ROUND_STRATEGY: string[] = [
  "Anchor bat or ace (best value at turn)",
  "Double-tap category strength (power/speed/ace)",
  "Secure SP1/SP2 or elite middle infield",
  "Take board value, prioritize 5-category hitters",
  "Stabilize ratios or lock first closer",
  "Position scarcity fill (C/SS/2B) or SP depth",
  "Add speed/power balance",
  "SP depth with K/9 and QS",
  "Best bat available, multi-position preferred",
  "Closer/SP value pocket",
  "Batting average and OBP stabilizer",
  "Rotation depth and innings floor",
  "Closer two or high-leverage RP",
  "Upside bat bench build",
  "SP streamable depth",
  "Late power target",
  "K/9 SP dart",
  "Speed specialist",
  "RP depth/speculative saves",
  "Injury stash/high-upside role bet",
  "Prospect upside swing",
  "Bench flexibility",
  "Final ceiling play",
];

function csvEscape(value: string | number): string {
  const text = String(value);
  if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
    return `"${text.replace(/\"/g, '""')}"`;
  }
  return text;
}

function getBeltersPickNumbers(): number[] {
  const picks: number[] = [];
  for (let round = 1; round <= 23; round += 1) {
    if (round % 2 === 1) {
      picks.push((round - 1) * 12 + 12); // rounds 1,3,5... => 12,36,60...
    } else {
      picks.push((round - 1) * 12 + 1); // rounds 2,4,6... => 13,37,61...
    }
  }
  return picks;
}

function getOptionsForPick(available: Player[], pickNumber: number, count: number): Player[] {
  const expectedIndex = Math.max(0, pickNumber - 1);

  // Always return count options by sliding the window near the draft slot.
  const maxStart = Math.max(0, available.length - count);
  const centeredStart = expectedIndex - Math.floor(count / 2);
  const start = Math.min(Math.max(0, centeredStart), maxStart);

  return available.slice(start, start + count);
}

function main(): void {
  const playersPath = path.join(process.cwd(), "public", "data", "players-2026.json");
  const players: Player[] = JSON.parse(readFileSync(playersPath, "utf8"));

  const availablePlayers = players
    .filter(player => !player.isKept)
    .sort((a, b) => a.adp - b.adp);

  const picks = getBeltersPickNumbers();

  const rows: string[] = [];
  rows.push(
    [
      "Round",
      "Pick #",
      "Expected Board Slot",
      "Strategy",
      "Option #",
      "Player",
      "Team",
      "Pos",
      "Rank",
      "R",
      "HR",
      "RBI",
      "SB",
      "AVG",
      "OPS",
      "ERA",
      "WHIP",
      "K/9",
      "QS",
      "SV",
      "W",
    ].join(","),
  );

  for (let round = 1; round <= 23; round += 1) {
    const pick = picks[round - 1];
    const optionsCount = round <= 8 ? 12 : 15; // 10-15 target options each round
    const options = getOptionsForPick(availablePlayers, pick, optionsCount);

    options.forEach((player, idx) => {
      const row = [
        idx === 0 ? round : "",
        idx === 0 ? pick : "",
        idx === 0 ? Math.max(1, pick - 1) : "",
        idx === 0 ? ROUND_STRATEGY[round - 1] : "",
        idx + 1,
        player.name,
        player.team,
        player.positions.join("/"),
        player.adp,
        player.batting ? player.batting.r : "",
        player.batting ? player.batting.hr : "",
        player.batting ? player.batting.rbi : "",
        player.batting ? player.batting.sb : "",
        player.batting ? player.batting.avg.toFixed(3) : "",
        player.batting ? player.batting.ops.toFixed(3) : "",
        player.pitching ? player.pitching.era.toFixed(2) : "",
        player.pitching ? player.pitching.whip.toFixed(2) : "",
        player.pitching ? player.pitching.k9.toFixed(1) : "",
        player.pitching ? player.pitching.qs : "",
        player.pitching ? player.pitching.nsv : "",
        player.pitching ? player.pitching.w : "",
      ].map(csvEscape);

      rows.push(row.join(","));
    });

    rows.push("");
  }

  const csv = `${rows.join("\n")}\n`;

  const draftGuidePath = path.join(process.cwd(), "public", "data", "belters-draft-guide.csv");
  const cheatSheetPath = path.join(process.cwd(), "public", "data", "belters-cheat-sheet.csv");

  writeFileSync(draftGuidePath, csv);
  writeFileSync(cheatSheetPath, csv);

  console.log(`✅ Draft guide written: ${draftGuidePath}`);
  console.log(`✅ Cheat sheet expanded: ${cheatSheetPath}`);
  console.log(`📊 Rounds: 23 | Options per round: 12-15 | Keepers excluded from options`);
}

main();
