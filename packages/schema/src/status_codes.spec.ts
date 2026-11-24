import { describe, expect, it } from "vitest";
import { EndpointConfig } from "./dto/endpoint/config.js";
import { isKnownStatusCode, STATUS_CODE_REASONS } from "./status_codes.js";

const base = {
  id: "1",
  method: "GET" as const,
  path: "a",
  responseSchema: { type: "string" },
};

describe("statusCode validation", () => {
  it("accepts every known status code", () => {
    for (const code of Object.keys(STATUS_CODE_REASONS).map(Number)) {
      expect(isKnownStatusCode(code)).toBe(true);
      expect(
        EndpointConfig.safeParse({ ...base, statusCode: code }).success,
      ).toBe(true);
    }
  });

  it.each([99, 299, 419, 599, 600, 200.5])(
    "rejects unknown code %s",
    (code) => {
      expect(
        EndpointConfig.safeParse({ ...base, statusCode: code }).success,
      ).toBe(false);
    },
  );

  it("defaults to 200", () => {
    expect(EndpointConfig.parse(base).statusCode).toBe(200);
  });
});
