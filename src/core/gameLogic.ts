export const createDigitValidator = (base: number) => {
  const allowedChars = "0123456789abcdef".slice(0, base);

  return (char: string): boolean => {
    if (char.length !== 1) return false;

    return allowedChars.includes(char.toLowerCase());
  };
};
