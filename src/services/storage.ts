import type { HighScore } from "../types";

const SCORE_KEY = "talestris_bulls_and_cows_highscores";
const MAX_RECORDS = 10;

export const getHighScores = (): HighScore[] => {
  const data = localStorage.getItem(SCORE_KEY);

  if (!data) return [];

  try {
    return JSON.parse(data) as HighScore[];
  } catch {
    return [];
  }
};

export const saveHighscore = (
  length: number,
  base: number,
  attempts: number,
  timeInMs: number
): HighScore[] => {
  const scores = getHighScores();

  const newRecord: HighScore = {
    length,
    base,
    attempts,
    time: Math.round(timeInMs / 1000),
    date: new Date().toLocaleDateString(),
  };

  scores.push(newRecord);

  scores.sort((a, b) => {
    if (a.attempts !== b.attempts) {
      return a.attempts - b.attempts;
    }
    return a.time - b.time;
  });

  const topScores = scores.slice(0, MAX_RECORDS);
  localStorage.setItem(SCORE_KEY, JSON.stringify(topScores));

  return topScores;
};
