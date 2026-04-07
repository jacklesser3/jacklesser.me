import { writeFileSync } from "node:fs";
import path from "node:path";

interface HittingProjection {
  Team?: string | null;
  PlayerName?: string;
  ADP?: number;
  R?: number;
  HR?: number;
  RBI?: number;
  SB?: number;
  AVG?: number;
  OPS?: number;
  PA?: number;
  Pos?: number | string;
  minpos?: string;
}

interface PitchingProjection {
  Team?: string | null;
  PlayerName?: string;
  ADP?: number;
  ERA?: number;
  WHIP?: number;
  "K/9"?: number;
  QS?: number;
  SV?: number;
  W?: number;
  IP?: number;
  Pos?: number | string;
  minpos?: string;
}

interface FantasyProsPlayer {
  player_name: string;
  player_team_id?: string;
  player_positions?: string;
  position_id?: string;
  primary_position?: string;
  rank_ecr: number;
}

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
  keeperOwner?: string;
}

const KEEPERS: Array<{ name: string; owner: string }> = [
  { name: "Mason Miller", owner: "Mitch Lesser" },
  { name: "Roman Anthony", owner: "Mitch Lesser" },
  { name: "Junior Caminero", owner: "Jack Lesser" },
  { name: "Bryan Woo", owner: "Jack Lesser" },
  { name: "Jac Caglianone", owner: "Grant Goodman" },
  { name: "Nolan McLean", owner: "Grant Goodman" },
  { name: "Shea Langeliers", owner: "Zack Davis" },
  { name: "Kevin Gausman", owner: "Zack Davis" },
  { name: "Jackson Chourio", owner: "Drew Davis" },
  { name: "Nick Kurtz", owner: "Drew Davis" },
  { name: "William Contreras", owner: "Sneider/Heame" },
  { name: "Freddy Peralta", owner: "Sneider/Heame" },
  { name: "Zach Neto", owner: "Tyler Isbitts" },
  { name: "Eury Perez", owner: "Tyler Isbitts" },
  { name: "Hunter Brown", owner: "Madey/Frazen" },
  { name: "Jacob Wilson", owner: "Madey/Frazen" },
  { name: "Paul Skenes", owner: "Matt LaPoff" },
  { name: "Spencer Strider", owner: "Matt LaPoff" },
  { name: "Garrett Crochet", owner: "Stimmel/Weiss" },
  { name: "Jeremy Peña", owner: "Stimmel/Weiss" },
  { name: "Jarren Duran", owner: "Sam Lefkowitz" },
  { name: "Hunter Goodman", owner: "Sam Lefkowitz" },
  { name: "Colton Montgomery", owner: "Alex Lefkowitz" },
  { name: "Jacob Misiorowski", owner: "Alex Lefkowitz" },
];

const TEAM_ALIASES: Record<string, string> = {
  KCR: "KC",
  WSN: "WSH",
  SFG: "SF",
  SDP: "SD",
  TBR: "TB",
  CHW: "CWS",
  CHC: "CHC",
  LAD: "LAD",
  NYY: "NYY",
  NYM: "NYM",
  BOS: "BOS",
  TOR: "TOR",
  BAL: "BAL",
  TB: "TB",
  CWS: "CWS",
  CLE: "CLE",
  DET: "DET",
  KC: "KC",
  MIN: "MIN",
  HOU: "HOU",
  LAA: "LAA",
  SEA: "SEA",
  TEX: "TEX",
  OAK: "ATH",
  ATH: "ATH",
  ATL: "ATL",
  MIA: "MIA",
  PHI: "PHI",
  WSH: "WSH",
  CHC2: "CHC",
  CIN: "CIN",
  MIL: "MIL",
  PIT: "PIT",
  STL: "STL",
  ARI: "ARI",
  COL: "COL",
  SF: "SF",
  SD: "SD",
};

function normalizeTeam(team: string | null | undefined): string {
  if (!team) return "FA";
  const cleaned = team.toUpperCase().trim();
  return TEAM_ALIASES[cleaned] ?? cleaned;
}

function normalizeName(name: string): string {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/(jr|sr|ii|iii|iv)$/g, "");

  // Keeper list typo safeguard: Colton Montgomery -> Colson Montgomery
  if (normalized === "coltonmontgomery") return "colsonmontgomery";

  return normalized;
}

function playerId(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isKept(name: string): { isKept: boolean; owner?: string } {
  const normalized = normalizeName(name);
  const keeper = KEEPERS.find(k => normalizeName(k.name) === normalized);
  return keeper ? { isKept: true, owner: keeper.owner } : { isKept: false };
}

function parseNextData<T>(html: string): T {
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) {
    throw new Error("Unable to find __NEXT_DATA__ payload from FanGraphs.");
  }
  return JSON.parse(match[1]) as T;
}

function extractBalancedObject(input: string, marker: string): string {
  const markerIdx = input.indexOf(marker);
  if (markerIdx === -1) {
    throw new Error(`Marker not found: ${marker}`);
  }

  const firstBrace = input.indexOf("{", markerIdx);
  if (firstBrace === -1) {
    throw new Error(`Could not find object start for marker: ${marker}`);
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = firstBrace; i < input.length; i += 1) {
    const ch = input[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") {
      depth += 1;
      continue;
    }

    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return input.slice(firstBrace, i + 1);
      }
    }
  }

  throw new Error(`Failed to close object for marker: ${marker}`);
}

function parseFantasyProsEcrPlayers(html: string): FantasyProsPlayer[] {
  const objectText = extractBalancedObject(html, "var ecrData =");
  const parsed = JSON.parse(objectText) as { players: FantasyProsPlayer[] };
  return parsed.players ?? [];
}

function projectionPositionFallback(pos: string | number | undefined): string[] {
  if (typeof pos === "string" && pos.trim()) {
    return normalizePositions(pos.split(/[\/,"]/).filter(Boolean));
  }
  return [];
}

function normalizePositions(raw: string[]): string[] {
  const mapped = raw
    .map(p => p.trim().toUpperCase())
    .flatMap(p => {
      if (!p) return [];
      if (p === "LF" || p === "CF" || p === "RF") return ["OF"];
      if (p === "P") return ["SP", "RP"];
      if (["C", "1B", "2B", "3B", "SS", "OF", "DH", "SP", "RP"].includes(p)) return [p];
      return [];
    });

  return [...new Set(mapped)];
}

function toFixedNumber(value: number | undefined, digits: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Number(value.toFixed(digits));
}

function getFanGraphsProjectionRows<T extends HittingProjection | PitchingProjection>(
  html: string,
): T[] {
  const nextData = parseNextData<any>(html);
  const queries = nextData?.props?.pageProps?.dehydratedState?.queries ?? [];
  const projectionQuery = queries.find((q: any) => {
    const key = JSON.stringify(q?.queryKey ?? []);
    return key.includes("/projections");
  });

  if (!projectionQuery || !Array.isArray(projectionQuery?.state?.data)) {
    throw new Error("Could not parse FanGraphs projection rows.");
  }

  return projectionQuery.state.data as T[];
}

function chooseBestProjection<T extends HittingProjection | PitchingProjection>(
  candidates: T[],
): T | undefined {
  if (candidates.length === 0) return undefined;
  return [...candidates].sort((a, b) => {
    const adpA = typeof a.ADP === "number" ? a.ADP : 9999;
    const adpB = typeof b.ADP === "number" ? b.ADP : 9999;
    if (adpA !== adpB) return adpA - adpB;

    const paA = typeof (a as HittingProjection).PA === "number" ? (a as any).PA : 0;
    const paB = typeof (b as HittingProjection).PA === "number" ? (b as any).PA : 0;
    const ipA = typeof (a as PitchingProjection).IP === "number" ? (a as any).IP : 0;
    const ipB = typeof (b as PitchingProjection).IP === "number" ? (b as any).IP : 0;

    return (paB + ipB) - (paA + ipA);
  })[0];
}

function buildProjectionLookup<T extends HittingProjection | PitchingProjection>(rows: T[]): {
  byName: Map<string, T[]>;
  byNameTeam: Map<string, T[]>;
} {
  const byName = new Map<string, T[]>();
  const byNameTeam = new Map<string, T[]>();

  for (const row of rows) {
    const name = row.PlayerName;
    if (!name) continue;

    const nameKey = normalizeName(name);
    const teamKey = normalizeTeam(row.Team ?? undefined);
    const nameTeamKey = `${nameKey}|${teamKey}`;

    byName.set(nameKey, [...(byName.get(nameKey) ?? []), row]);
    byNameTeam.set(nameTeamKey, [...(byNameTeam.get(nameTeamKey) ?? []), row]);
  }

  return { byName, byNameTeam };
}

function resolveProjection<T extends HittingProjection | PitchingProjection>(
  lookup: { byName: Map<string, T[]>; byNameTeam: Map<string, T[]> },
  name: string,
  team: string,
): T | undefined {
  const nameKey = normalizeName(name);
  const teamKey = normalizeTeam(team);

  const exact = lookup.byNameTeam.get(`${nameKey}|${teamKey}`) ?? [];
  if (exact.length > 0) return chooseBestProjection(exact);

  const fallback = lookup.byName.get(nameKey) ?? [];
  return chooseBestProjection(fallback);
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed request (${response.status}) for URL: ${url}`);
  }

  return response.text();
}

async function buildPlayers(): Promise<Player[]> {
  const fantasyProsUrl = "https://www.fantasypros.com/mlb/rankings/overall.php";
  const fanGraphsHittersUrl =
    "https://www.fangraphs.com/projections?pos=all&stats=bat&type=steamer&season=2026&team=0&players=0&sort=0,1";
  const fanGraphsPitchersUrl =
    "https://www.fangraphs.com/projections?pos=all&stats=pit&type=steamer&season=2026&team=0&players=0&sort=0,1";

  const [fpHtml, fgHittersHtml, fgPitchersHtml] = await Promise.all([
    fetchText(fantasyProsUrl),
    fetchText(fanGraphsHittersUrl),
    fetchText(fanGraphsPitchersUrl),
  ]);

  const allRankedPlayers = parseFantasyProsEcrPlayers(fpHtml)
    .filter(p => Number.isInteger(p.rank_ecr))
    .sort((a, b) => a.rank_ecr - b.rank_ecr);

  const top300 = allRankedPlayers.filter(p => p.rank_ecr <= 300);
  if (top300.length < 300) {
    throw new Error(`Expected at least 300 ranked players, got ${top300.length}.`);
  }

  const keeperNameSet = new Set(KEEPERS.map(k => normalizeName(k.name)));
  const selected = [...top300];
  const selectedNameSet = new Set(selected.map(p => normalizeName(p.player_name)));

  const missingKeeperCandidates = allRankedPlayers
    .filter(p => keeperNameSet.has(normalizeName(p.player_name)) && !selectedNameSet.has(normalizeName(p.player_name)))
    .sort((a, b) => a.rank_ecr - b.rank_ecr);

  for (const keeperCandidate of missingKeeperCandidates) {
    const removeIndex = selected
      .map((player, index) => ({ player, index }))
      .filter(item => !keeperNameSet.has(normalizeName(item.player.player_name)))
      .sort((a, b) => b.player.rank_ecr - a.player.rank_ecr)[0]?.index;

    if (removeIndex === undefined) break;

    selected.splice(removeIndex, 1, keeperCandidate);
    selectedNameSet.add(normalizeName(keeperCandidate.player_name));
  }

  const rankingPlayers = selected
    .sort((a, b) => a.rank_ecr - b.rank_ecr)
    .slice(0, 300);

  const hitterRows = getFanGraphsProjectionRows<HittingProjection>(fgHittersHtml);
  const pitcherRows = getFanGraphsProjectionRows<PitchingProjection>(fgPitchersHtml);

  const hitterLookup = buildProjectionLookup(hitterRows);
  const pitcherLookup = buildProjectionLookup(pitcherRows);

  const players: Player[] = [];
  const unmatched: string[] = [];

  for (const ranked of rankingPlayers) {
    const name = ranked.player_name;
    const team = normalizeTeam(ranked.player_team_id);
    const normalizedPosSource = ranked.player_positions ?? ranked.position_id ?? ranked.primary_position ?? "";
    const positions = normalizePositions(normalizedPosSource.split(",").map(s => s.trim())).filter(Boolean);

    const hitterProjection = resolveProjection(hitterLookup, name, team);
    const pitcherProjection = resolveProjection(pitcherLookup, name, team);

    const hitterEligible = positions.some(p => ["C", "1B", "2B", "3B", "SS", "OF", "DH"].includes(p));
    const pitcherEligible = positions.some(p => ["SP", "RP", "P"].includes(p));

    const batting = hitterProjection && (hitterEligible || !pitcherEligible)
      ? {
          r: Math.round(hitterProjection.R ?? 0),
          hr: Math.round(hitterProjection.HR ?? 0),
          rbi: Math.round(hitterProjection.RBI ?? 0),
          sb: Math.round(hitterProjection.SB ?? 0),
          avg: toFixedNumber(hitterProjection.AVG ?? 0, 3),
          ops: toFixedNumber(hitterProjection.OPS ?? 0, 3),
        }
      : null;

    const pitching = pitcherProjection && (pitcherEligible || !hitterEligible)
      ? {
          era: toFixedNumber(pitcherProjection.ERA ?? 0, 2),
          whip: toFixedNumber(pitcherProjection.WHIP ?? 0, 2),
          k9: toFixedNumber(pitcherProjection["K/9"] ?? 0, 1),
          qs: Math.round(pitcherProjection.QS ?? 0),
          nsv: Math.round(pitcherProjection.SV ?? 0),
          w: Math.round(pitcherProjection.W ?? 0),
        }
      : null;

    if (!batting && !pitching) {
      unmatched.push(`${ranked.rank_ecr}: ${name} (${team})`);
    }

    const resolvedPositions =
      positions.length > 0
        ? positions
        : normalizePositions([
            ...(hitterProjection?.minpos ? hitterProjection.minpos.split("/") : []),
            ...(pitcherProjection?.minpos ? pitcherProjection.minpos.split("/") : []),
            ...projectionPositionFallback(hitterProjection?.Pos),
            ...projectionPositionFallback(pitcherProjection?.Pos),
          ]);

    const keeperStatus = isKept(name);

    players.push({
      id: playerId(name),
      name,
      team,
      positions: resolvedPositions.length > 0 ? resolvedPositions : [batting ? "Util" : "P"],
      batting,
      pitching,
      adp: ranked.rank_ecr,
      isKept: keeperStatus.isKept,
      keeperOwner: keeperStatus.owner,
    });
  }

  const missingKeeperList = KEEPERS.filter(k =>
    !players.some(p => normalizeName(p.name) === normalizeName(k.name)),
  );

  let keeperFallbackAdp = 1000;
  for (const keeper of missingKeeperList) {
    const hitterProjection = resolveProjection(hitterLookup, keeper.name, "");
    const pitcherProjection = resolveProjection(pitcherLookup, keeper.name, "");

    if (!hitterProjection && !pitcherProjection) {
      unmatched.push("keeper-missing: " + keeper.name);
      continue;
    }

    const batting = hitterProjection
      ? {
          r: Math.round(hitterProjection.R ?? 0),
          hr: Math.round(hitterProjection.HR ?? 0),
          rbi: Math.round(hitterProjection.RBI ?? 0),
          sb: Math.round(hitterProjection.SB ?? 0),
          avg: toFixedNumber(hitterProjection.AVG ?? 0, 3),
          ops: toFixedNumber(hitterProjection.OPS ?? 0, 3),
        }
      : null;

    const pitching = pitcherProjection
      ? {
          era: toFixedNumber(pitcherProjection.ERA ?? 0, 2),
          whip: toFixedNumber(pitcherProjection.WHIP ?? 0, 2),
          k9: toFixedNumber(pitcherProjection["K/9"] ?? 0, 1),
          qs: Math.round(pitcherProjection.QS ?? 0),
          nsv: Math.round(pitcherProjection.SV ?? 0),
          w: Math.round(pitcherProjection.W ?? 0),
        }
      : null;

    const positions = normalizePositions([
      ...(hitterProjection?.minpos ? hitterProjection.minpos.split("/") : []),
      ...(pitcherProjection?.minpos ? pitcherProjection.minpos.split("/") : []),
      ...projectionPositionFallback(hitterProjection?.Pos),
      ...projectionPositionFallback(pitcherProjection?.Pos),
    ]);

    const replacementIndex = players
      .map((player, index) => ({ player, index }))
      .filter(item => !item.player.isKept)
      .sort((a, b) => b.player.adp - a.player.adp)[0]?.index;

    if (replacementIndex === undefined) break;

    players.splice(replacementIndex, 1, {
      id: playerId(keeper.name),
      name: keeper.name,
      team: normalizeTeam(hitterProjection?.Team ?? pitcherProjection?.Team ?? "FA"),
      positions: positions.length > 0 ? positions : [batting ? "Util" : "P"],
      batting,
      pitching,
      adp: keeperFallbackAdp++,
      isKept: true,
      keeperOwner: keeper.owner,
    });
  }

  if (unmatched.length > 0) {
    console.warn(`⚠️ Could not map projection stats for ${unmatched.length} players.`);
    console.warn(unmatched.slice(0, 20).join("\n"));
  }

  return players;
}

async function main(): Promise<void> {
  const players = await buildPlayers();
  const outputPath = path.join(process.cwd(), "public", "data", "players-2026.json");

  writeFileSync(outputPath, `${JSON.stringify(players, null, 2)}\n`);

  console.log(`✅ Generated ${players.length} real players from 2026 sources`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`🔒 Keepers marked: ${players.filter(p => p.isKept).length}`);
  console.log(`📊 Hitters: ${players.filter(p => p.batting).length} | Pitchers: ${players.filter(p => p.pitching).length}`);
}

main().catch(err => {
  console.error("❌ Failed to generate player projections:");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
