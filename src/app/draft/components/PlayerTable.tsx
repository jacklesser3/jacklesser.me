"use client";

import { useState, useMemo } from "react";
import { ScoredPlayer } from "../lib/types";

interface PlayerTableProps {
  players: ScoredPlayer[];
  onDraftPlayer: (player: ScoredPlayer) => void;
  draftedPlayerIds: Set<string>;
}

type SortKey = "name" | "value" | "adp" | "hr" | "k9";
type SortDirection = "asc" | "desc";

export function PlayerTable({ players, onDraftPlayer, draftedPlayerIds }: PlayerTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredAndSortedPlayers = useMemo(() => {
    let filtered = players.filter(p => !draftedPlayerIds.has(p.id) && !p.isKept);

    // Apply search filter
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(lower) || p.team.toLowerCase().includes(lower)
      );
    }

    // Apply position filter
    if (positionFilter !== "All") {
      filtered = filtered.filter(p => p.positions.includes(positionFilter));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      switch (sortKey) {
        case "name":
          aVal = a.name;
          bVal = b.name;
          break;
        case "value":
          aVal = a.value;
          bVal = b.value;
          break;
        case "adp":
          aVal = a.adp;
          bVal = b.adp;
          break;
        case "hr":
          aVal = a.batting?.hr || 0;
          bVal = b.batting?.hr || 0;
          break;
        case "k9":
          aVal = a.pitching?.k9 || 0;
          bVal = b.pitching?.k9 || 0;
          break;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return sortDirection === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return filtered;
  }, [players, searchTerm, positionFilter, sortKey, sortDirection, draftedPlayerIds]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return "⇅";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const positions = ["All", "C", "1B", "2B", "3B", "SS", "OF", "SP", "RP", "P"];

  return (
    <div className="player-table">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={positionFilter}
          onChange={e => setPositionFilter(e.target.value)}
          className="position-filter"
        >
          {positions.map(pos => (
            <option key={pos} value={pos}>
              {pos === "All" ? "All Positions" : pos}
            </option>
          ))}
        </select>
        <div className="result-count">{filteredAndSortedPlayers.length} players</div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")} className="sortable">
                Name {getSortIcon("name")}
              </th>
              <th>Team</th>
              <th>Pos</th>
              <th onClick={() => handleSort("value")} className="sortable">
                Value {getSortIcon("value")}
              </th>
              <th onClick={() => handleSort("adp")} className="sortable">
                ADP {getSortIcon("adp")}
              </th>
              <th onClick={() => handleSort("hr")} className="sortable">
                HR {getSortIcon("hr")}
              </th>
              <th>R</th>
              <th>RBI</th>
              <th>SB</th>
              <th onClick={() => handleSort("k9")} className="sortable">
                K/9 {getSortIcon("k9")}
              </th>
              <th>ERA</th>
              <th>W</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedPlayers.slice(0, 100).map(player => (
              <tr key={player.id} className={player.value > filteredAndSortedPlayers[Math.floor(filteredAndSortedPlayers.length * 0.2)]?.value ? "high-value" : ""}>
                <td className="player-name">{player.name}</td>
                <td>{player.team}</td>
                <td className="positions">{player.positions.join(", ")}</td>
                <td className="value">{player.value.toFixed(1)}</td>
                <td>{player.adp || "-"}</td>
                <td>{player.batting?.hr || "-"}</td>
                <td>{player.batting?.r || "-"}</td>
                <td>{player.batting?.rbi || "-"}</td>
                <td>{player.batting?.sb || "-"}</td>
                <td>{player.pitching?.k9?.toFixed(1) || "-"}</td>
                <td>{player.pitching?.era?.toFixed(2) || "-"}</td>
                <td>{player.pitching?.w || "-"}</td>
                <td>
                  <button onClick={() => onDraftPlayer(player)} className="draft-button">
                    Draft
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .player-table {
          background: var(--background-elevated);
          border-radius: 8px;
          padding: 1rem;
          overflow: hidden;
        }

        .table-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-input {
          flex: 1;
          min-width: 200px;
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: var(--background);
          color: var(--text-primary);
          font-size: 14px;
        }

        .position-filter {
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background: var(--background);
          color: var(--text-primary);
          font-size: 14px;
        }

        .result-count {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .table-wrapper {
          overflow-x: auto;
          max-height: 600px;
          overflow-y: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        thead {
          position: sticky;
          top: 0;
          background: var(--background-elevated);
          z-index: 1;
        }

        th {
          padding: 0.75rem 0.5rem;
          text-align: left;
          border-bottom: 2px solid var(--border-color);
          font-weight: 600;
          white-space: nowrap;
        }

        th.sortable {
          cursor: pointer;
          user-select: none;
        }

        th.sortable:hover {
          background: var(--background);
        }

        td {
          padding: 0.75rem 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        tr:hover {
          background: var(--background);
        }

        tr.high-value {
          border-left: 3px solid var(--accent-blue);
        }

        .player-name {
          font-weight: 500;
        }

        .positions {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .value {
          font-weight: 600;
          color: var(--accent-blue);
        }

        .draft-button {
          padding: 0.375rem 0.75rem;
          background: var(--accent-green);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
        }

        .draft-button:hover {
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .table-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .search-input {
            min-width: unset;
          }
        }
      `}</style>
    </div>
  );
}
