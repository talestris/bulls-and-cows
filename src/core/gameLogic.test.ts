import { describe, it, expect } from "vitest";
import { createDigitValidator, isValidGuess, evaluateGuess } from "./gameLogic";

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
