"use client";

import { useState, useEffect, useCallback } from "react";
import { DraftPick, DraftState } from "./types";

const STORAGE_KEY = "fantasy-baseball-draft-state";
const TOTAL_TEAMS = 12;
const TOTAL_ROUNDS = 23;
const USER_TEAM_NUMBER = 12; // Picking last

function getInitialState(): DraftState {
  return {
    picks: [],
    currentPickNumber: 1,
    currentTeam: 1,
    userTeamNumber: USER_TEAM_NUMBER,
  };
}

function loadStateFromStorage(): DraftState {
  if (typeof window === "undefined") return getInitialState();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading draft state:", error);
  }

  return getInitialState();
}

function saveStateToStorage(state: DraftState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving draft state:", error);
  }
}

// Calculate which team picks at a given pick number (snake draft)
function getTeamForPick(pickNumber: number): number {
  const round = Math.ceil(pickNumber / TOTAL_TEAMS);
  const positionInRound = ((pickNumber - 1) % TOTAL_TEAMS) + 1;

  // Odd rounds: 1→12, Even rounds: 12→1
  if (round % 2 === 1) {
    return positionInRound;
  } else {
    return TOTAL_TEAMS - positionInRound + 1;
  }
}

function getRoundForPick(pickNumber: number): number {
  return Math.ceil(pickNumber / TOTAL_TEAMS);
}

export function useDraftState() {
  const [state, setState] = useState<DraftState>(getInitialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loadedState = loadStateFromStorage();
    setState(loadedState);
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      saveStateToStorage(state);
    }
  }, [state, isLoaded]);

  const addPick = useCallback((playerId: string, playerName: string, teamNumber?: number) => {
    setState(prevState => {
      const pickNumber = prevState.currentPickNumber;
      const team = teamNumber ?? getTeamForPick(pickNumber);
      const round = getRoundForPick(pickNumber);

      const newPick: DraftPick = {
        pickNumber,
        round,
        teamNumber: team,
        playerId,
        playerName,
        timestamp: Date.now(),
      };

      const nextPickNumber = pickNumber + 1;
      const nextTeam = getTeamForPick(nextPickNumber);

      return {
        ...prevState,
        picks: [...prevState.picks, newPick],
        currentPickNumber: nextPickNumber,
        currentTeam: nextTeam,
      };
    });
  }, []);

  const undoPick = useCallback(() => {
    setState(prevState => {
      if (prevState.picks.length === 0) return prevState;

      const newPicks = prevState.picks.slice(0, -1);
      const lastPick = newPicks[newPicks.length - 1];

      const nextPickNumber = lastPick ? lastPick.pickNumber + 1 : 1;
      const nextTeam = getTeamForPick(nextPickNumber);

      return {
        ...prevState,
        picks: newPicks,
        currentPickNumber: nextPickNumber,
        currentTeam: nextTeam,
      };
    });
  }, []);

  const resetDraft = useCallback(() => {
    const initialState = getInitialState();
    setState(initialState);
    saveStateToStorage(initialState);
  }, []);

  const getUserPicks = useCallback(() => {
    return state.picks.filter(pick => pick.teamNumber === USER_TEAM_NUMBER);
  }, [state.picks]);

  const isUserTurn = useCallback(() => {
    return state.currentTeam === USER_TEAM_NUMBER;
  }, [state.currentTeam]);

  const getPicksUntilUserTurn = useCallback(() => {
    if (isUserTurn()) return 0;

    let picksAway = 0;
    for (let i = state.currentPickNumber; i <= TOTAL_TEAMS * TOTAL_ROUNDS; i++) {
      if (getTeamForPick(i) === USER_TEAM_NUMBER) {
        picksAway = i - state.currentPickNumber;
        break;
      }
    }
    return picksAway;
  }, [state.currentPickNumber, isUserTurn]);

  return {
    picks: state.picks,
    currentPickNumber: state.currentPickNumber,
    currentTeam: state.currentTeam,
    currentRound: getRoundForPick(state.currentPickNumber),
    userTeamNumber: USER_TEAM_NUMBER,
    isLoaded,
    addPick,
    undoPick,
    resetDraft,
    getUserPicks,
    isUserTurn,
    getPicksUntilUserTurn,
    getTeamForPick,
    getRoundForPick,
  };
}
