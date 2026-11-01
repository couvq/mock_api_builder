import { capitalize } from "./capitalize";

describe("capitalize", () => {
  it("returns an empty string unchanged", () => {
    expect(capitalize("")).toBe("");
  });

  it("capitalizes the first character", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("leaves the remaining characters unchanged", () => {
    expect(capitalize("hELLO")).toBe("HELLO");
  });
});
