"use client";

import { useMemo } from "react";
import { ScoredPlayer, DraftPick } from "../lib/types";

interface RosterTrackerProps {
  players: ScoredPlayer[];
  userPicks: DraftPick[];
}

const ROSTER_REQUIREMENTS = [
  { position: "C", count: 1, label: "Catcher" },
  { position: "1B", count: 1, label: "First Base" },
  { position: "2B", count: 1, label: "Second Base" },
  { position: "3B", count: 1, label: "Third Base" },
  { position: "SS", count: 1, label: "Shortstop" },
  { position: "OF", count: 3, label: "Outfield" },
  { position: "Util", count: 2, label: "Utility" },
  { position: "SP", count: 1, label: "Starting Pitcher" },
  { position: "RP", count: 1, label: "Relief Pitcher" },
  { position: "P", count: 6, label: "Pitcher" },
  { position: "BN", count: 6, label: "Bench" },
];

const TOTAL_PICKS = 23;

export function RosterTracker({ players, userPicks }: RosterTrackerProps) {
  const userPlayers = useMemo(() => {
    const userPlayerIds = userPicks.map(p => p.playerId);
    return players.filter(p => userPlayerIds.includes(p.id));
  }, [players, userPicks]);

  const positionCounts = useMemo(() => {
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

    userPlayers.forEach(player => {
      player.positions.forEach(pos => {
        if (counts[pos] !== undefined) {
          counts[pos]++;
        }
      });
    });

    return counts;
  }, [userPlayers]);

  const needsByPosition = useMemo(() => {
    const needs: Record<string, boolean> = {};

    ROSTER_REQUIREMENTS.forEach(req => {
      if (req.position === "Util" || req.position === "BN") {
        needs[req.position] = false; // Don't flag these as needs
      } else if (req.position === "P") {
        const totalPitchers = positionCounts.SP + positionCounts.RP + positionCounts.P;
        needs[req.position] = totalPitchers < req.count;
      } else {
        needs[req.position] = positionCounts[req.position] < req.count;
      }
    });

    return needs;
  }, [positionCounts]);

  return (
    <div className="roster-tracker">
      <div className="roster-header">
        <h3>Your Roster</h3>
        <div className="pick-counter">
          {userPicks.length} / {TOTAL_PICKS} picks
        </div>
      </div>

      <div className="roster-positions">
        {ROSTER_REQUIREMENTS.map(req => {
          const isFilled = !needsByPosition[req.position];
          const count = req.position === "P"
            ? positionCounts.SP + positionCounts.RP + positionCounts.P
            : positionCounts[req.position] || 0;

          return (
            <div
              key={req.position}
              className={`position-slot ${!isFilled && req.position !== "Util" && req.position !== "BN" ? "needs-fill" : ""}`}
            >
              <div className="position-label">
                {req.label} ({req.position})
              </div>
              <div className="position-count">
                {count} / {req.count}
              </div>
            </div>
          );
        })}
      </div>

      <div className="roster-players">
        <h4>Drafted Players</h4>
        {userPlayers.length === 0 ? (
          <div className="empty-state">No players drafted yet</div>
        ) : (
          <div className="player-list">
            {userPlayers.map(player => (
              <div key={player.id} className="roster-player">
                <div className="player-info">
                  <div className="player-name">{player.name}</div>
                  <div className="player-meta">
                    {player.team} • {player.positions.join(", ")}
                  </div>
                </div>
                <div className="player-stats">
                  {player.batting && (
                    <span className="key-stat">HR: {player.batting.hr}</span>
                  )}
                  {player.pitching && (
                    <span className="key-stat">K/9: {player.pitching.k9.toFixed(1)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .roster-tracker {
          background: var(--background-elevated);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .roster-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        h4 {
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .pick-counter {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--accent-blue);
        }

        .roster-positions {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .position-slot {
          background: var(--background);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .position-slot.needs-fill {
          background: rgba(255, 193, 7, 0.1);
          border-color: #ffc107;
        }

        .position-label {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .position-count {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .roster-players {
          border-top: 1px solid var(--border-color);
          padding-top: 1.5rem;
        }

        .empty-state {
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary);
          font-style: italic;
        }

        .player-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .roster-player {
          background: var(--background);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .player-info {
          flex: 1;
        }

        .player-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .player-meta {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .player-stats {
          display: flex;
          gap: 0.75rem;
        }

        .key-stat {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--accent-green);
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .roster-tracker {
            padding: 1rem;
          }

          .roster-positions {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }

          .roster-player {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
