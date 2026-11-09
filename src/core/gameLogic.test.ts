import { describe, it, expect } from "vitest";
import {
  createDigitValidator,
  isValidGuess,
  evaluateGuess,
  generateSecret,
  countPossibleSecrets,
} from "./gameLogic";

describe("createDigitValidator", () => {
  it("should validate digits for binary system (base 2)", () => {
    const isBinaryDigit = createDigitValidator(2);

    expect(isBinaryDigit("0")).toBe(true);
    expect(isBinaryDigit("1")).toBe(true);
    expect(isBinaryDigit("2")).toBe(false);
  });

  it("should validate digits for octal system (base 8)", () => {
    const isOctalDigit = createDigitValidator(8);

    expect(isOctalDigit("7")).toBe(true);
    expect(isOctalDigit("0")).toBe(true);
    expect(isOctalDigit("8")).toBe(false);
  });

  it("should validate digits for decimal system (base 10)", () => {
    const isDecimalDigit = createDigitValidator(10);

    expect(isDecimalDigit("5")).toBe(true);
    expect(isDecimalDigit("0")).toBe(true);
    expect(isDecimalDigit("a")).toBe(false);
  });

  it("should validate digits for hexadecimal system (base 16) case insensitively", () => {
    const isHexDigit = createDigitValidator(16);

    expect(isHexDigit("9")).toBe(true);
    expect(isHexDigit("a")).toBe(true);
    expect(isHexDigit("F")).toBe(true);
    expect(isHexDigit("g")).toBe(false);
  });
});

describe("isValidGuess", () => {
  it("should return true for a perfectly valid decimal guess", () => {
    expect(isValidGuess("1234", 4, 10)).toBe(true);
  });

  it("should return false if the length is incorrect", () => {
    expect(isValidGuess("123", 4, 10)).toBe(false);
    expect(isValidGuess("12345", 4, 10)).toBe(false);
  });

  it("should return false if there are duplicate characters", () => {
    expect(isValidGuess("1123", 4, 10)).toBe(false);
  });

  it("should return false if characters are invalid for the base", () => {
    expect(isValidGuess("123a", 4, 10)).toBe(false);
    expect(isValidGuess("123g", 4, 16)).toBe(false);
  });

  it("should work case-insensitively for valid hex duplicate checks", () => {
    expect(isValidGuess("12aA", 4, 10)).toBe(false);
  });
});

describe("evaluateGuess", () => {
  it("should return 4 bulls for an exact match", () => {
    const result = evaluateGuess(["1", "2", "3", "4"], ["1", "2", "3", "4"]);
    expect(result).toEqual({ bulls: 4, cows: 0 });
  });

  it("it should return cows for digits on wrong places", () => {
    const result = evaluateGuess(["1", "2", "3", "4"], ["4", "3", "2", "1"]);
    expect(result).toEqual({ bulls: 0, cows: 4 });
  });

  it("should correctly mix bulls and cows", () => {
    const result = evaluateGuess(["1", "2", "3", "4"], ["1", "2", "4", "5"]);
    expect(result).toEqual({ bulls: 2, cows: 1 });
  });

  it("should work case-insensitively for hex characters", () => {
    const result = evaluateGuess(["a", "b", "c", "d"], ["a", "z", "b", "y"]);
    expect(result).toEqual({ bulls: 1, cows: 1 });
  });
});

describe("generateSecret", () => {
  it("should generate a secret of a correct length", () => {
    const secret = generateSecret(4, 10);
    expect(secret.length).toBe(4);
  });

  it("should generate a secret with unique characters", () => {
    const secret = generateSecret(6, 16);
    const uniqueChars = new Set(secret);
    expect(uniqueChars.size).toBe(6);
  });

  it("should be deterministic when custom random source is provided", () => {
    const mockValues = [0.1, 0.2, 0.3, 0.4];
    let callCount = 0;

    const mockRandom = () => mockValues[callCount++];

    callCount = 0;
    const secret1 = generateSecret(4, 10, mockRandom);

    callCount = 0;
    const secret2 = generateSecret(4, 10, mockRandom);

    expect(secret1).toEqual(secret2);
    expect(secret1.length).toBe(4);
  });
});

describe("countPossibleSecrets", () => {
  it("should calculate permutations correctly", () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });

  it("should return 1 if length is 0 (base case)", () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });
});
