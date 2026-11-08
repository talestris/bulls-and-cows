export const createDigitValidator = (base: number) => {
  const allowedChars = "0123456789abcdef".slice(0, base);

  return (char: string): boolean => {
    if (char.length !== 1) return false;

    return allowedChars.includes(char.toLowerCase());
  };
};

export const isValidGuess = (guess: string, length: number, base: number): boolean => {
  if (guess.length !== length) return false;

  const chars = guess.toLowerCase().split("");

  const uniqueChars = new Set(chars);
  if (uniqueChars.size !== length) return false;

  const isCharValid = createDigitValidator(base);

  return chars.every((char) => isCharValid(char));
};

export const evaluateGuess = (
  secret: string[],
  guess: string[]
): { bulls: number; cows: number } => {
  const normSecret = secret.map((char) => char.toLowerCase());
  const normGuess = guess.map((char) => char.toLowerCase());

  const bulls = normGuess.filter((char, index) => char === normSecret[index]).length;

  const cows = normGuess.filter((char, index) => {
    const isBull = char === normSecret[index];
    const existsInSecret = normSecret.includes(char);

    return !isBull && existsInSecret;
  }).length;

  return { bulls, cows };
};

export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random
): string[] => {
  if (length && base && random) return [];
  return [];
};
