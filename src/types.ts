export interface Attempt {
  guess: string;
  bulls: number;
  cows: number;
}

export interface GameSettings {
  length: number;
  base: number;
}

export type GameStatus = "setup" | "playing" | "won";

export interface GameState {
  settings: GameSettings;
  status: GameStatus;
  secret: string[];
  history: Attempt[];
  startTime: number | null;
}
