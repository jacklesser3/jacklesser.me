"use client";

import { DraftPick } from "../lib/types";

interface DraftBoardProps {
  picks: DraftPick[];
  currentPickNumber: number;
  userTeamNumber: number;
  onUndoPick: () => void;
  getTeamForPick: (pickNumber: number) => number;
  getRoundForPick: (pickNumber: number) => number;
}

const TOTAL_TEAMS = 12;
const TOTAL_ROUNDS = 23;

export function DraftBoard({
  picks,
  currentPickNumber,
  userTeamNumber,
  onUndoPick,
  getTeamForPick,
  getRoundForPick,
}: DraftBoardProps) {
  const picksByNumber = new Map(picks.map(p => [p.pickNumber, p]));

  // Only show recent rounds for mobile
  const currentRound = getRoundForPick(currentPickNumber);
  const visibleRounds = 5;
  const startRound = Math.max(1, currentRound - 2);
  const endRound = Math.min(TOTAL_ROUNDS, startRound + visibleRounds - 1);

  return (
    <div className="draft-board">
      <div className="board-header">
        <h3>Draft Board</h3>
        <div className="board-controls">
          <div className="current-pick">
            Pick {currentPickNumber} (Round {currentRound})
          </div>
          {picks.length > 0 && (
            <button onClick={onUndoPick} className="undo-button">
              ← Undo Last Pick
            </button>
          )}
        </div>
      </div>

      <div className="board-grid-wrapper">
        <table className="board-grid">
          <thead>
            <tr>
              <th className="round-header">Rd</th>
              {Array.from({ length: TOTAL_TEAMS }, (_, i) => (
                <th key={i + 1} className={i + 1 === userTeamNumber ? "user-team" : ""}>
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: endRound - startRound + 1 }, (_, i) => {
              const round = startRound + i;
              const isSnakeReverse = round % 2 === 0;

              return (
                <tr key={round}>
                  <td className="round-cell">{round}</td>
                  {Array.from({ length: TOTAL_TEAMS }, (_, j) => {
                    const teamNumber = isSnakeReverse ? TOTAL_TEAMS - j : j + 1;
                    const pickNumber = (round - 1) * TOTAL_TEAMS + j + 1;
                    const pick = picksByNumber.get(pickNumber);
                    const isUserPick = teamNumber === userTeamNumber;
                    const isCurrent = pickNumber === currentPickNumber;

                    return (
                      <td
                        key={teamNumber}
                        className={`
                          pick-cell
                          ${isUserPick ? "user-pick" : ""}
                          ${isCurrent ? "current" : ""}
                          ${pick ? "filled" : ""}
                        `}
                      >
                        {pick ? (
                          <div className="pick-content">
                            <div className="pick-name">{pick.playerName}</div>
                            <div className="pick-number">#{pickNumber}</div>
                          </div>
                        ) : (
                          <div className="pick-placeholder">
                            {isCurrent ? "◀ Now" : `#${pickNumber}`}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .draft-board {
          background: var(--background-elevated);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .board-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .board-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .current-pick {
          font-size: 1rem;
          font-weight: 600;
          color: var(--accent-blue);
        }

        .undo-button {
          padding: 0.5rem 1rem;
          background: var(--background);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
        }

        .undo-button:hover {
          background: var(--background-hover);
        }

        .board-grid-wrapper {
          overflow-x: auto;
          overflow-y: auto;
          max-height: 500px;
        }

        .board-grid {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.75rem;
        }

        thead {
          position: sticky;
          top: 0;
          background: var(--background-elevated);
          z-index: 2;
        }

        th {
          padding: 0.5rem 0.25rem;
          text-align: center;
          border: 1px solid var(--border-color);
          font-weight: 600;
          background: var(--background);
          min-width: 80px;
        }

        th.round-header {
          min-width: 40px;
          position: sticky;
          left: 0;
          z-index: 3;
          background: var(--background-elevated);
        }

        th.user-team {
          background: rgba(76, 175, 80, 0.2);
          color: var(--accent-green);
        }

        .round-cell {
          padding: 0.5rem;
          text-align: center;
          border: 1px solid var(--border-color);
          font-weight: 600;
          background: var(--background);
          position: sticky;
          left: 0;
          z-index: 1;
        }

        .pick-cell {
          padding: 0.5rem 0.25rem;
          text-align: center;
          border: 1px solid var(--border-color);
          min-height: 60px;
          vertical-align: middle;
        }

        .pick-cell.user-pick {
          background: rgba(76, 175, 80, 0.1);
        }

        .pick-cell.current {
          background: rgba(33, 150, 243, 0.2);
          border-color: var(--accent-blue);
          border-width: 2px;
        }

        .pick-cell.filled {
          background: var(--background);
        }

        .pick-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .pick-name {
          font-weight: 600;
          font-size: 0.8rem;
          line-height: 1.2;
        }

        .pick-number {
          font-size: 0.7rem;
          color: var(--text-secondary);
        }

        .pick-placeholder {
          color: var(--text-secondary);
          font-size: 0.75rem;
        }

        @media (max-width: 768px) {
          .draft-board {
            padding: 1rem;
          }

          .board-header {
            flex-direction: column;
            align-items: flex-start;
          }

          th, .pick-cell {
            min-width: 60px;
            font-size: 0.7rem;
            padding: 0.375rem 0.125rem;
          }

          .pick-name {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}
