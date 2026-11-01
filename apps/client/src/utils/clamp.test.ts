import { clamp } from "./clamp";

describe("clamp", () => {
  it("returns the value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to the minimum", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it("clamps to the maximum", () => {
    expect(clamp(42, 0, 10)).toBe(10);
  });
});
