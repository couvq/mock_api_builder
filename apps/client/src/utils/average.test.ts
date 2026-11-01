import { average } from "./average";

describe("average", () => {
  it("returns the mean of the numbers", () => {
    expect(average([2, 4, 6])).toBe(4);
  });
});
