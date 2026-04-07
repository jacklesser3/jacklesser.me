"use client";

import { useMemo } from "react";
import { ScoredPlayer, DraftPick } from "../lib/types";

interface RecommendationPanelProps {
  players: ScoredPlayer[];
  draftedPlayerIds: Set<string>;
  userPicks: DraftPick[];
  onDraftPlayer: (player: ScoredPlayer) => void;
  picksUntilUserTurn: number;
}

const POSITION_SLOTS = {
  C: 1,
  "1B": 1,
  "2B": 1,
  "3B": 1,
  SS: 1,
  OF: 3,
  SP: 1,
  RP: 1,
  P: 6, // Any pitcher
};

export function RecommendationPanel({
  players,
  draftedPlayerIds,
  userPicks,
  onDraftPlayer,
  picksUntilUserTurn,
}: RecommendationPanelProps) {
  const recommendations = useMemo(() => {
    // Count user's current roster by position
    const rosterCounts: Record<string, number> = {
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

    const userPlayerIds = new Set(userPicks.map(p => p.playerId));
    const userPlayers = players.filter(p => userPlayerIds.has(p.id));

    userPlayers.forEach(player => {
      player.positions.forEach(pos => {
        if (rosterCounts[pos] !== undefined) {
          rosterCounts[pos]++;
        }
      });
    });

    // Identify position needs
    const positionNeeds: string[] = [];
    Object.entries(POSITION_SLOTS).forEach(([pos, requiredCount]) => {
      if (pos === "P") {
        // P includes SP and RP
        const totalPitchers = rosterCounts.SP + rosterCounts.RP + rosterCounts.P;
        if (totalPitchers < requiredCount) {
          positionNeeds.push(pos);
        }
      } else if (rosterCounts[pos] < requiredCount) {
        positionNeeds.push(pos);
      }
    });

    // Get available players
    const availablePlayers = players.filter(
      p => !draftedPlayerIds.has(p.id) && !userPlayerIds.has(p.id) && !p.isKept
    );

    // Score players based on position needs and value
    const scoredRecommendations = availablePlayers.map(player => {
      let score = player.value;

      // Boost score if fills a position need
      const fillsNeed = player.positions.some(pos => positionNeeds.includes(pos));
      if (fillsNeed) {
        score *= 1.3;
      }

      // Extra boost for scarce positions if we're far from next pick
      if (picksUntilUserTurn > 20) {
        const hasScarcePosition = player.positions.some(pos => pos === "C" || pos === "SS");
        if (hasScarcePosition && positionNeeds.some(need => player.positions.includes(need))) {
          score *= 1.2;
        }
      }

      return {
        player,
        score,
        fillsNeed,
        reason: getRecommendationReason(player, positionNeeds, fillsNeed, picksUntilUserTurn),
      };
    });

    // Sort by score and return top 5
    scoredRecommendations.sort((a, b) => b.score - a.score);
    return scoredRecommendations.slice(0, 5);
  }, [players, draftedPlayerIds, userPicks, picksUntilUserTurn]);

  return (
    <div className="recommendation-panel">
      <h3>Recommended Picks</h3>
      <div className="recommendations-list">
        {recommendations.map((rec, idx) => (
          <div key={rec.player.id} className="recommendation-card">
            <div className="rec-header">
              <div className="rec-rank">#{idx + 1}</div>
              <div className="rec-info">
                <div className="rec-name">{rec.player.name}</div>
                <div className="rec-meta">
                  {rec.player.team} • {rec.player.positions.join(", ")}
                </div>
              </div>
              <div className="rec-value">{rec.score.toFixed(1)}</div>
            </div>

            <div className="rec-stats">
              {rec.player.batting && (
                <div className="stat-group">
                  <span className="stat-label">HR:</span> <span className="stat-value">{rec.player.batting.hr}</span>
                  <span className="stat-label">R:</span> <span className="stat-value">{rec.player.batting.r}</span>
                  <span className="stat-label">RBI:</span> <span className="stat-value">{rec.player.batting.rbi}</span>
                  <span className="stat-label">SB:</span> <span className="stat-value">{rec.player.batting.sb}</span>
                </div>
              )}
              {rec.player.pitching && (
                <div className="stat-group">
                  <span className="stat-label">K/9:</span> <span className="stat-value">{rec.player.pitching.k9.toFixed(1)}</span>
                  <span className="stat-label">ERA:</span> <span className="stat-value">{rec.player.pitching.era.toFixed(2)}</span>
                  <span className="stat-label">W:</span> <span className="stat-value">{rec.player.pitching.w}</span>
                </div>
              )}
            </div>

            <div className="rec-reason">{rec.reason}</div>

            <button onClick={() => onDraftPlayer(rec.player)} className="quick-draft-button">
              Quick Draft
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .recommendation-panel {
          background: var(--background-elevated);
          border-radius: 8px;
          padding: 1.5rem;
        }

        h3 {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .recommendation-card {
          background: var(--background);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 1rem;
        }

        .rec-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .rec-rank {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--accent-blue);
          min-width: 32px;
        }

        .rec-info {
          flex: 1;
        }

        .rec-name {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .rec-meta {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .rec-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--accent-green);
        }

        .rec-stats {
          margin-bottom: 0.75rem;
          padding: 0.5rem;
          background: var(--background-elevated);
          border-radius: 4px;
        }

        .stat-group {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          font-size: 0.875rem;
        }

        .stat-label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .stat-value {
          font-weight: 600;
          margin-right: 0.5rem;
        }

        .rec-reason {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-style: italic;
          margin-bottom: 0.75rem;
        }

        .quick-draft-button {
          width: 100%;
          padding: 0.625rem;
          background: var(--accent-green);
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .quick-draft-button:hover {
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .recommendation-panel {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

function getRecommendationReason(
  player: ScoredPlayer,
  positionNeeds: string[],
  fillsNeed: boolean,
  picksUntilTurn: number
): string {
  const primaryPos = player.positions[0];

  if (fillsNeed) {
    const neededPos = player.positions.find(pos => positionNeeds.includes(pos));
    if (neededPos === "C") {
      return "Elite catcher - scarce position, fills roster need";
    }
    if (neededPos === "SS") {
      return "Premium shortstop - high-value position, fills need";
    }
    return `Fills ${neededPos} position need with strong value`;
  }

  if (picksUntilTurn > 20 && (primaryPos === "C" || primaryPos === "SS")) {
    return "Take scarce position now - long wait until next pick";
  }

  if (player.batting && player.batting.hr > 35) {
    return "Elite power bat - strong in weighted HR category";
  }

  if (player.pitching && player.pitching.k9 > 11) {
    return "High strikeout arm - strong in weighted K/9 category";
  }

  return "Best player available based on value score";
}
