"use client";

import { useState, useEffect, useMemo } from "react";
import { Player, ScoredPlayer } from "./lib/types";
import { calculatePlayerValues } from "./lib/scoring";
import { useDraftState } from "./lib/draft-state";
import { PlayerTable } from "./components/PlayerTable";
import { RecommendationPanel } from "./components/RecommendationPanel";
import { RosterTracker } from "./components/RosterTracker";
import { DraftBoard } from "./components/DraftBoard";
import { DraftStrategy } from "./components/DraftStrategy";

export function DraftWarRoom() {
  const [players, setPlayers] = useState<ScoredPlayer[]>([]);
  const [allPlayersRaw, setAllPlayersRaw] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    picks,
    currentPickNumber,
    currentTeam,
    currentRound,
    userTeamNumber,
    isLoaded: isDraftStateLoaded,
    addPick,
    undoPick,
    resetDraft,
    getUserPicks,
    isUserTurn,
    getPicksUntilUserTurn,
    getTeamForPick,
    getRoundForPick,
  } = useDraftState();

  // Load player data on mount
  useEffect(() => {
    async function loadPlayers() {
      try {
        const response = await fetch("/data/players-2026.json");
        if (!response.ok) {
          throw new Error("Failed to load player data");
        }
        const data: Player[] = await response.json();
        setAllPlayersRaw(data);
        const scoredPlayers = calculatePlayerValues(data);
        setPlayers(scoredPlayers);
      } catch (err) {
        console.error("Error loading players:", err);
        setError("Failed to load player data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPlayers();
  }, []);

  // Get available players (not drafted and not kept)
  const availablePlayers = useMemo(() => {
    const draftedIds = new Set(picks.map(p => p.playerId));
    return players.filter(p => !draftedIds.has(p.id) && !p.isKept);
  }, [players, picks]);

  const draftedPlayerIds = useMemo(() => {
    return new Set(picks.map(p => p.playerId));
  }, [picks]);

  const keepers = useMemo(() => {
    return allPlayersRaw.filter(player => player.isKept);
  }, [allPlayersRaw]);

  const userPicks = useMemo(() => getUserPicks(), [getUserPicks]);

  const handleDraftPlayer = (player: ScoredPlayer) => {
    addPick(player.id, player.name);
  };

  const handleResetDraft = () => {
    if (confirm("Are you sure you want to reset the entire draft? This cannot be undone.")) {
      resetDraft();
    }
  };

  if (!isDraftStateLoaded || isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div>Loading draft war room...</div>

        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 1rem;
            color: var(--text-secondary);
          }

          .loading-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid var(--border-color);
            border-top-color: var(--accent-blue);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">⚠️ {error}</div>
        <style jsx>{`
          .error-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
          }

          .error-message {
            color: var(--error-color, #f44336);
            font-size: 1.125rem;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="draft-war-room">
      <header className="war-room-header">
        <div className="header-content">
          <h1>⚾ Draft War Room</h1>
          <div className="header-info">
            <div className="draft-info">
              <div className="info-item">
                <span className="label">Round:</span>
                <span className="value">{currentRound}</span>
              </div>
              <div className="info-item">
                <span className="label">Pick:</span>
                <span className="value">{currentPickNumber}</span>
              </div>
              <div className="info-item">
                <span className="label">Team:</span>
                <span className="value">Team {currentTeam}</span>
              </div>
              {isUserTurn() ? (
                <div className="user-turn">🎯 YOUR TURN!</div>
              ) : (
                <div className="picks-away">
                  {getPicksUntilUserTurn()} picks until your turn
                </div>
              )}
            </div>
            <button onClick={handleResetDraft} className="reset-button">
              Reset Draft
            </button>
          </div>
        </div>
      </header>

      <div className="war-room-grid">
        {/* Draft Strategy - Primary Focus */}
        <div className="full-width-panel strategy-panel">
          <DraftStrategy
            availablePlayers={availablePlayers}
            draftablePlayers={players}
            keepers={keepers}
            userPicks={userPicks}
            currentPickNumber={currentPickNumber}
            userTeamNumber={userTeamNumber}
          />
        </div>

        <div className="main-panel">
          <PlayerTable
            players={availablePlayers}
            onDraftPlayer={handleDraftPlayer}
            draftedPlayerIds={draftedPlayerIds}
          />
        </div>

        <div className="side-panels">
          <RecommendationPanel
            players={players}
            draftedPlayerIds={draftedPlayerIds}
            userPicks={userPicks}
            onDraftPlayer={handleDraftPlayer}
            picksUntilUserTurn={getPicksUntilUserTurn()}
          />

          <RosterTracker players={players} userPicks={userPicks} />
        </div>

        <div className="full-width-panel">
          <DraftBoard
            picks={picks}
            currentPickNumber={currentPickNumber}
            userTeamNumber={userTeamNumber}
            onUndoPick={undoPick}
            getTeamForPick={getTeamForPick}
            getRoundForPick={getRoundForPick}
          />
        </div>
      </div>

      <style jsx>{`
        .draft-war-room {
          min-height: 100vh;
          background: var(--background);
          color: var(--text-primary);
        }

        .war-room-header {
          position: sticky;
          top: 0;
          z-index: 10;
          background: var(--background-elevated);
          border-bottom: 2px solid var(--border-color);
          padding: 1rem 2rem;
        }

        .header-content {
          max-width: 1800px;
          margin: 0 auto;
        }

        h1 {
          margin: 0 0 1rem 0;
          font-size: 1.75rem;
          font-weight: 700;
        }

        .header-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .draft-info {
          display: flex;
          gap: 2rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .info-item {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .label {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .value {
          font-weight: 600;
          font-size: 1rem;
        }

        .user-turn {
          padding: 0.5rem 1rem;
          background: var(--accent-green);
          color: white;
          border-radius: 4px;
          font-weight: 700;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .picks-away {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .reset-button {
          padding: 0.5rem 1rem;
          background: var(--background);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .reset-button:hover {
          background: var(--background-hover);
          color: var(--text-primary);
        }

        .war-room-grid {
          max-width: 1800px;
          margin: 0 auto;
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 1.5rem;
        }

        .main-panel {
          grid-column: 1;
        }

        .side-panels {
          grid-column: 2;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .full-width-panel {
          grid-column: 1 / -1;
        }

        .strategy-panel {
          order: -1; /* Show strategy first */
        }

        @media (max-width: 1200px) {
          .war-room-grid {
            grid-template-columns: 1fr;
            padding: 1rem;
          }

          .main-panel,
          .side-panels,
          .full-width-panel {
            grid-column: 1;
          }
        }

        @media (max-width: 768px) {
          .war-room-header {
            padding: 1rem;
          }

          h1 {
            font-size: 1.5rem;
          }

          .draft-info {
            gap: 1rem;
          }

          .header-info {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
