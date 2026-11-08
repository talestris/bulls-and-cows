export const createDigitValidator = (base: number) => {
  return (char: string): boolean => {
    if (base && char) return false;
    return false;
  };
};
