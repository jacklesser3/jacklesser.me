"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DraftPick, Player, ScoredPlayer } from "../lib/types";

interface DraftStrategyProps {
  availablePlayers: ScoredPlayer[];
  draftablePlayers: ScoredPlayer[];
  keepers: Player[];
  userPicks: DraftPick[];
  currentPickNumber: number;
  userTeamNumber: number;
}

interface PickOption {
  player: ScoredPlayer;
  availability: number;
  impactScore: number;
  impactReason: string;
}

interface PickPlan {
  round: number;
  pickNumber: number;
  options: PickOption[];
  lockedPlayerId: string | null;
  needSummary: string;
}

const TOTAL_ROUNDS = 23;

const ROSTER_REQUIREMENTS: Record<string, number> = {
  C: 1,
  "1B": 1,
  "2B": 1,
  "3B": 1,
  SS: 1,
  OF: 3,
  SP: 1,
  RP: 1,
  P: 6,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizeOwner(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getSnakePick(round: number, totalTeams: number, draftSlot: number): number {
  if (round % 2 === 1) {
    return (round - 1) * totalTeams + draftSlot;
  }

  return (round - 1) * totalTeams + (totalTeams - draftSlot + 1);
}

function getUserPickNumbers(totalTeams: number, draftSlot: number): number[] {
  return Array.from({ length: TOTAL_ROUNDS }, (_, idx) => getSnakePick(idx + 1, totalTeams, draftSlot));
}

function toPercent(probability: number): number {
  return Math.round(probability * 100);
}

function getAvailabilityLabel(probability: number): string {
  if (probability >= 0.75) return "Likely available";
  if (probability >= 0.45) return "Toss-up";
  return "Likely gone";
}

function availabilityProbability(playerAdp: number, pickNumber: number): number {
  if (!Number.isFinite(playerAdp) || playerAdp <= 0) return 0.5;

  const delta = pickNumber - playerAdp;
  const probability = 1 / (1 + Math.exp(-delta / 14));
  return clamp(probability, 0.03, 0.97);
}

function getRosterCounts(players: Array<Pick<Player, "positions">>): Record<string, number> {
  const counts: Record<string, number> = {
    C: 0,
    "1B": 0,
    "2B": 0,
    "3B": 0,
    SS: 0,
    OF: 0,
    SP: 0,
    RP: 0,
    P: 0,
  };

  players.forEach(player => {
    player.positions.forEach(position => {
      if (counts[position] !== undefined) {
        counts[position] += 1;
      }
    });
  });

  return counts;
}

function getDeficits(counts: Record<string, number>): Record<string, number> {
  const deficits: Record<string, number> = {};

  Object.entries(ROSTER_REQUIREMENTS).forEach(([position, required]) => {
    if (position === "P") {
      const totalPitchers = counts.SP + counts.RP + counts.P;
      deficits[position] = Math.max(0, required - totalPitchers);
      return;
    }

    deficits[position] = Math.max(0, required - (counts[position] || 0));
  });

  return deficits;
}

function getNeedSummary(deficits: Record<string, number>): string {
  const needs = Object.entries(deficits)
    .filter(([, remaining]) => remaining > 0)
    .map(([position, remaining]) => `${position}:${remaining}`)
    .slice(0, 5);

  return needs.length > 0 ? `Needs ${needs.join(" • ")}` : "Core roster slots mostly filled";
}

function getPositionNeedBonus(player: ScoredPlayer, deficits: Record<string, number>): number {
  let bonus = 0;

  player.positions.forEach(position => {
    const deficit = deficits[position] || 0;
    if (deficit > 0) {
      bonus += deficit * 1.8;
    }

    if (position === "C" || position === "SS") {
      bonus += 0.6;
    }
  });

  if (player.pitching && deficits.P > 0) {
    bonus += deficits.P * 1.2;
  }

  return bonus;
}

function getImpactReason(player: ScoredPlayer, deficits: Record<string, number>): string {
  const urgentPositions = player.positions.filter(position => (deficits[position] || 0) > 0);

  if (urgentPositions.length > 0) {
    return `Fills need at ${urgentPositions.join("/")}`;
  }

  if (player.pitching && deficits.P > 0) {
    return "Adds needed pitching volume";
  }

  if (player.batting && player.batting.hr >= 30) {
    return "Power impact";
  }

  if (player.pitching && player.pitching.k9 >= 10) {
    return "Strikeout impact";
  }

  return "Best value at this slot";
}

function scoreOption(player: ScoredPlayer, pickNumber: number, deficits: Record<string, number>): PickOption {
  const availability = availabilityProbability(player.adp, pickNumber);
  const needBonus = getPositionNeedBonus(player, deficits);
  const impactScore = player.value + needBonus;
  const impactReason = getImpactReason(player, deficits);

  return {
    player,
    availability,
    impactScore,
    impactReason,
  };
}

function getPickOptions(
  availablePlayers: ScoredPlayer[],
  pickNumber: number,
  deficits: Record<string, number>,
  optionCount: number
): PickOption[] {
  const scored = availablePlayers
    .map(player => scoreOption(player, pickNumber, deficits))
    .filter(option => option.availability >= 0.1)
    .sort((a, b) => {
      const aComposite = a.impactScore * (0.5 + a.availability);
      const bComposite = b.impactScore * (0.5 + b.availability);
      return bComposite - aComposite;
    });

  return scored.slice(0, optionCount);
}

function statsSummary(player: ScoredPlayer): string {
  if (player.batting) {
    return `HR ${player.batting.hr} | R ${player.batting.r} | RBI ${player.batting.rbi} | SB ${player.batting.sb} | AVG ${player.batting.avg.toFixed(3)} | OPS ${player.batting.ops.toFixed(3)}`;
  }

  if (player.pitching) {
    return `ERA ${player.pitching.era.toFixed(2)} | WHIP ${player.pitching.whip.toFixed(2)} | K/9 ${player.pitching.k9.toFixed(1)} | QS ${player.pitching.qs} | SV ${player.pitching.nsv} | W ${player.pitching.w}`;
  }

  return "-";
}

function getSortedLockedPicks(myPickLocks: Record<number, string>): Array<[number, string]> {
  return Object.entries(myPickLocks)
    .map(([pickNumber, playerId]) => [Number(pickNumber), playerId] as [number, string])
    .sort((a, b) => a[0] - b[0]);
}

export function DraftStrategy({
  availablePlayers,
  draftablePlayers,
  keepers,
  userPicks,
  currentPickNumber,
  userTeamNumber,
}: DraftStrategyProps) {
  const [managerName, setManagerName] = useState("Jack Lesser");
  const [totalTeams, setTotalTeams] = useState(12);
  const [draftSlot, setDraftSlot] = useState(userTeamNumber);
  const [optionsPerPick, setOptionsPerPick] = useState(10);
  const [futurePicksToShow, setFuturePicksToShow] = useState(10);

  const [takenPlayerIds, setTakenPlayerIds] = useState<string[]>([]);
  const [myPickLocks, setMyPickLocks] = useState<Record<number, string>>({});
  const seededInitialPlanRef = useRef(false);

  const availablePlayerIds = useMemo(() => new Set(availablePlayers.map(player => player.id)), [availablePlayers]);

  useEffect(() => {
    setTakenPlayerIds(prev => prev.filter(playerId => availablePlayerIds.has(playerId)));
    setMyPickLocks(prev => {
      const next: Record<number, string> = {};

      Object.entries(prev).forEach(([pickNumber, playerId]) => {
        if (availablePlayerIds.has(playerId)) {
          next[Number(pickNumber)] = playerId;
        }
      });

      return next;
    });
  }, [availablePlayerIds]);

  useEffect(() => {
    if (seededInitialPlanRef.current) {
      return;
    }

    if (Object.keys(myPickLocks).length > 0 || availablePlayers.length === 0) {
      seededInitialPlanRef.current = true;
      return;
    }

    const userPickNumbers = getUserPickNumbers(totalTeams, draftSlot);
    if (userPickNumbers.length < 2) {
      seededInitialPlanRef.current = true;
      return;
    }

    const vladimir = availablePlayers.find(player =>
      normalizeText(player.name).includes("vladimirguerrerojr")
    );
    const yordan = availablePlayers.find(player =>
      normalizeText(player.name).includes("yordanalvarez")
    );

    if (!vladimir || !yordan) {
      seededInitialPlanRef.current = true;
      return;
    }

    setMyPickLocks({
      [userPickNumbers[0]]: vladimir.id,
      [userPickNumbers[1]]: yordan.id,
    });
    seededInitialPlanRef.current = true;
  }, [availablePlayers, draftSlot, myPickLocks, totalTeams]);

  const playersById = useMemo(() => {
    return new Map(draftablePlayers.map(player => [player.id, player]));
  }, [draftablePlayers]);

  const myKeepers = useMemo(() => {
    const ownerKey = normalizeOwner(managerName);
    return keepers.filter(player => normalizeOwner(player.keeperOwner || "") === ownerKey);
  }, [keepers, managerName]);

  const myDraftedPlayers = useMemo(() => {
    return userPicks
      .map(pick => playersById.get(pick.playerId))
      .filter((player): player is ScoredPlayer => Boolean(player));
  }, [userPicks, playersById]);

  const takenPlayerSet = useMemo(() => new Set(takenPlayerIds), [takenPlayerIds]);

  const pickPlans = useMemo(() => {
    const userPicksByRound = getUserPickNumbers(totalTeams, draftSlot).filter(
      pickNumber => pickNumber >= currentPickNumber
    );

    const availableMap = new Map(availablePlayers.map(player => [player.id, player]));

    const poolMap = new Map<string, ScoredPlayer>();
    availablePlayers.forEach(player => {
      if (!takenPlayerSet.has(player.id)) {
        poolMap.set(player.id, player);
      }
    });

    const simulatedRoster: Array<Pick<Player, "positions">> = [...myKeepers, ...myDraftedPlayers];

    const plans: PickPlan[] = [];

    userPicksByRound.forEach(pickNumber => {
      const rosterCounts = getRosterCounts(simulatedRoster);
      const deficits = getDeficits(rosterCounts);

      const pool = Array.from(poolMap.values());
      const lockedPlayerId = myPickLocks[pickNumber] || null;

      let options = getPickOptions(pool, pickNumber, deficits, optionsPerPick);

      if (lockedPlayerId) {
        const lockedPlayer = availableMap.get(lockedPlayerId);
        if (lockedPlayer && poolMap.has(lockedPlayerId)) {
          const lockedOption = scoreOption(lockedPlayer, pickNumber, deficits);
          options = [lockedOption, ...options.filter(option => option.player.id !== lockedPlayerId)];
          options = options.slice(0, optionsPerPick);
        }
      }

      plans.push({
        round: Math.ceil(pickNumber / totalTeams),
        pickNumber,
        options,
        lockedPlayerId,
        needSummary: getNeedSummary(deficits),
      });

      if (lockedPlayerId && poolMap.has(lockedPlayerId)) {
        const lockedPlayer = poolMap.get(lockedPlayerId);
        if (lockedPlayer) {
          simulatedRoster.push(lockedPlayer);
        }
        poolMap.delete(lockedPlayerId);
      }
    });

    return plans;
  }, [
    availablePlayers,
    currentPickNumber,
    draftSlot,
    myDraftedPlayers,
    myKeepers,
    myPickLocks,
    optionsPerPick,
    takenPlayerSet,
    totalTeams,
  ]);

  const visiblePlans = pickPlans.slice(0, futurePicksToShow);

  const lockedPicks = useMemo(() => getSortedLockedPicks(myPickLocks), [myPickLocks]);

  const lockedPlayerIdsSet = useMemo(() => new Set(Object.values(myPickLocks)), [myPickLocks]);

  const handleMarkTaken = (playerId: string) => {
    setTakenPlayerIds(prev => (prev.includes(playerId) ? prev : [...prev, playerId]));
    setMyPickLocks(prev => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([pickNumber, lockedPlayerId]) => {
        if (lockedPlayerId !== playerId) {
          next[Number(pickNumber)] = lockedPlayerId;
        }
      });
      return next;
    });
  };

  const handleRestoreTaken = (playerId: string) => {
    setTakenPlayerIds(prev => prev.filter(id => id !== playerId));
  };

  const handleAssignMyPick = (pickNumber: number, playerId: string) => {
    setTakenPlayerIds(prev => prev.filter(id => id !== playerId));
    setMyPickLocks(prev => {
      const next: Record<number, string> = {};

      Object.entries(prev).forEach(([existingPickNumber, lockedPlayerId]) => {
        const asNumber = Number(existingPickNumber);
        if (asNumber !== pickNumber && lockedPlayerId !== playerId) {
          next[asNumber] = lockedPlayerId;
        }
      });

      next[pickNumber] = playerId;
      return next;
    });
  };

  const handleClearMyPick = (pickNumber: number) => {
    setMyPickLocks(prev => {
      const next = { ...prev };
      delete next[pickNumber];
      return next;
    });
  };

  const handleResetScenario = () => {
    setTakenPlayerIds([]);
    setMyPickLocks({});
  };

  return (
    <div className="draft-strategy">
      <div className="header-row">
        <div>
          <h2>Your Pick Map</h2>
          <p className="subtitle">
            Remove picked players, lock your targets by pick, and the next rounds update automatically.
          </p>
        </div>
        <button className="reset-sim-button" onClick={handleResetScenario}>
          Reset Scenario
        </button>
      </div>

      <div className="control-grid">
        <label>
          <span>Keeper Owner Name</span>
          <input value={managerName} onChange={event => setManagerName(event.target.value)} />
        </label>

        <label>
          <span>Total Teams</span>
          <input
            type="number"
            min={8}
            max={20}
            value={totalTeams}
            onChange={event => setTotalTeams(clamp(Number(event.target.value) || 12, 8, 20))}
          />
        </label>

        <label>
          <span>Your Draft Slot</span>
          <input
            type="number"
            min={1}
            max={totalTeams}
            value={draftSlot}
            onChange={event => setDraftSlot(clamp(Number(event.target.value) || userTeamNumber, 1, totalTeams))}
          />
        </label>

        <label>
          <span>Options Per Pick</span>
          <input
            type="number"
            min={6}
            max={15}
            value={optionsPerPick}
            onChange={event => setOptionsPerPick(clamp(Number(event.target.value) || 10, 6, 15))}
          />
        </label>

        <label>
          <span>Upcoming Picks Shown</span>
          <input
            type="number"
            min={3}
            max={23}
            value={futurePicksToShow}
            onChange={event => setFuturePicksToShow(clamp(Number(event.target.value) || 10, 3, 23))}
          />
        </label>
      </div>

      <div className="summary-row">
        <div className="summary-card">
          <div className="summary-title">Taken By Others</div>
          <div className="summary-value">{takenPlayerIds.length}</div>
        </div>

        <div className="summary-card wide">
          <div className="summary-title">My Locked Picks</div>
          <div className="summary-value small">
            {lockedPicks.length === 0
              ? "None yet"
              : lockedPicks
                  .map(([pickNumber, playerId]) => {
                    const player = playersById.get(playerId);
                    return `#${pickNumber}: ${player?.name || "Unknown"}`;
                  })
                  .join(" | ")}
          </div>
        </div>
      </div>

      <div className="plans-wrap">
        {visiblePlans.map(plan => (
          <div key={plan.pickNumber} className="pick-plan">
            <div className="plan-header">
              <div>
                <h3>
                  Round {plan.round} • Pick {plan.pickNumber}
                </h3>
                <div className="need-summary">{plan.needSummary}</div>
              </div>
              <span>{plan.options.length} options</span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Pos</th>
                    <th>ADP</th>
                    <th>Avail %</th>
                    <th>Impact</th>
                    <th>Why</th>
                    <th>Stats</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.options.map(option => {
                    const playerId = option.player.id;
                    const isTaken = takenPlayerSet.has(playerId);
                    const isLockedAtThisPick = plan.lockedPlayerId === playerId;
                    const isLockedElsewhere =
                      lockedPlayerIdsSet.has(playerId) && !isLockedAtThisPick;

                    return (
                      <tr
                        key={`${plan.pickNumber}-${playerId}`}
                        className={`${isLockedAtThisPick ? "row-locked" : ""} ${isTaken ? "row-taken" : ""}`}
                      >
                        <td>
                          <div className="name-cell">{option.player.name}</div>
                          <div className="team-cell">{option.player.team}</div>
                        </td>
                        <td>{option.player.positions.join("/")}</td>
                        <td>{option.player.adp}</td>
                        <td>
                          {toPercent(option.availability)}%{" "}
                          <span className="muted">{getAvailabilityLabel(option.availability)}</span>
                        </td>
                        <td>{option.impactScore.toFixed(1)}</td>
                        <td>{option.impactReason}</td>
                        <td className="stats-cell">{statsSummary(option.player)}</td>
                        <td>
                          <div className="actions-cell">
                            {isLockedAtThisPick ? (
                              <button
                                className="mini-button secondary"
                                onClick={() => handleClearMyPick(plan.pickNumber)}
                              >
                                Undo My Pick
                              </button>
                            ) : (
                              <button
                                className="mini-button primary"
                                onClick={() => handleAssignMyPick(plan.pickNumber, playerId)}
                                disabled={isLockedElsewhere}
                              >
                                {isLockedElsewhere ? "Locked at Other Pick" : "My Pick"}
                              </button>
                            )}

                            {isTaken ? (
                              <button
                                className="mini-button secondary"
                                onClick={() => handleRestoreTaken(playerId)}
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                className="mini-button danger"
                                onClick={() => handleMarkTaken(playerId)}
                              >
                                Mark Taken
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .draft-strategy {
          background: var(--background-elevated);
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.75rem;
        }

        h2 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 700;
        }

        .subtitle {
          margin: 0.3rem 0 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .reset-sim-button {
          border: 1px solid var(--border-color);
          background: var(--background);
          color: var(--text-primary);
          border-radius: 6px;
          padding: 0.45rem 0.7rem;
          font-size: 0.8rem;
          cursor: pointer;
          white-space: nowrap;
        }

        .control-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 0.65rem;
          padding: 0.85rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--background);
        }

        .control-grid label {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .control-grid input {
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 0.4rem 0.5rem;
          color: var(--text-primary);
          background: #fff;
        }

        .summary-row {
          display: grid;
          grid-template-columns: minmax(150px, 180px) 1fr;
          gap: 0.55rem;
        }

        .summary-card {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 0.65rem;
          background: var(--background);
        }

        .summary-card.wide {
          overflow: hidden;
        }

        .summary-title {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .summary-value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .summary-value.small {
          font-size: 0.82rem;
          line-height: 1.35;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .plans-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .pick-plan {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 0.75rem;
        }

        .plan-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.55rem;
          gap: 0.75rem;
        }

        h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
        }

        .need-summary {
          margin-top: 0.2rem;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .plan-header span {
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
        }

        th,
        td {
          border-bottom: 1px solid var(--border-color);
          text-align: left;
          padding: 0.45rem 0.35rem;
          vertical-align: top;
        }

        th {
          color: var(--text-secondary);
          font-weight: 600;
        }

        .name-cell {
          font-weight: 600;
        }

        .team-cell {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .muted {
          font-size: 0.72rem;
          color: var(--text-secondary);
        }

        .stats-cell {
          min-width: 340px;
          color: var(--text-secondary);
          font-size: 0.78rem;
          line-height: 1.35;
        }

        .actions-cell {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          min-width: 130px;
        }

        .mini-button {
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background: var(--background);
          padding: 0.28rem 0.45rem;
          font-size: 0.74rem;
          cursor: pointer;
          line-height: 1.2;
          text-align: center;
        }

        .mini-button.primary {
          border-color: var(--accent-green);
          background: rgba(76, 175, 80, 0.1);
          color: #1f7a27;
        }

        .mini-button.secondary {
          border-color: var(--border-color);
          color: var(--text-secondary);
        }

        .mini-button.danger {
          border-color: #f7b1b1;
          background: #fff5f5;
          color: #b72020;
        }

        .mini-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .row-locked {
          background: rgba(76, 175, 80, 0.08);
        }

        .row-taken {
          background: rgba(244, 67, 54, 0.06);
        }

        @media (max-width: 960px) {
          .summary-row {
            grid-template-columns: 1fr;
          }

          .stats-cell {
            min-width: 260px;
          }

          table {
            font-size: 0.78rem;
          }
        }
      `}</style>
    </div>
  );
}
