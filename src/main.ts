import type { GameState, GameSettings } from "./types";
import { generateSecret } from "./core/gameLogic";
import { renderApp } from "./view";

const DEFAULT_SETTINGS: GameSettings = {
  length: 4,
  base: 10,
};

let state: GameState = {
  settings: { ...DEFAULT_SETTINGS },
  status: "setup",
  secret: [],
  history: [],
  startTime: null,
};

export const getState = (): GameState => state;

export const startNewRound = (settings: GameSettings): void => {
  state = {
    settings: { ...settings },
    status: "playing",
    secret: generateSecret(settings.length, settings.base),
    history: [],
    startTime: Date.now(),
  };

  renderApp();
};

export const addGameAttempt = (guessStr: string, bulls: number, cows: number): void => {
  const newAttempt = { guess: guessStr, bulls, cows };

  const isWon = bulls === state.settings.length;

  state = {
    ...state,
    history: [...state.history, newAttempt],
    status: isWon ? "won" : "playing",
  };

  renderApp();
};

export const resetToSetup = (): void => {
  state = {
    settings: { ...state.settings },
    status: "setup",
    secret: [],
    history: [],
    startTime: null,
  };

  renderApp();
};

renderApp();
