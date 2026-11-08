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
