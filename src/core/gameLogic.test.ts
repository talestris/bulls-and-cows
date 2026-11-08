import { describe, it, expect } from "vitest";
import { createDigitValidator } from "./gameLogic";

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
