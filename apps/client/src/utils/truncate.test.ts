import { truncate } from "./truncate";

describe("truncate", () => {
  it("returns the value unchanged when within the limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates and appends an ellipsis when over the limit", () => {
    expect(truncate("hello world", 5)).toBe("hello…");
  });
});
