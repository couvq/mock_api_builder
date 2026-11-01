import { formatBytes } from "./formatBytes";

describe("formatBytes", () => {
  it("returns '0 B' for zero bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("formats byte-range values with the default decimals", () => {
    expect(formatBytes(500)).toBe("500.0 B");
  });

  it("formats kilobytes", () => {
    expect(formatBytes(1024)).toBe("1.0 KB");
  });

  it("respects a custom decimals argument", () => {
    expect(formatBytes(1536, 2)).toBe("1.50 KB");
  });

  it("formats larger units", () => {
    expect(formatBytes(1048576)).toBe("1.0 MB");
  });
});
