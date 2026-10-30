import { http, HttpResponse } from "msw";
import { getAllEndpoints, updateEndpoint } from ".";
import {
  sampleEndpoint,
  server,
} from "../../test/server";

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("endpoint api tests", () => {
  describe("getAllEndpoints", () => {
    it("should return endpoint configs upon successful 200 response", async () => {
      const result = await getAllEndpoints();
      expect(result).toEqual([sampleEndpoint]);
    });

    it("should throw an error if the response is not ok", async () => {
      const statusCode = 500;
      const statusText = "Internal Server Error";
      server.use(
        http.get(
          "*/endpoint",
          async () =>
            new HttpResponse(null, { status: statusCode, statusText }),
        ),
      );
      await expect(getAllEndpoints()).rejects.toThrow(
        `Failed to fetch endpoints: ${statusCode} ${statusText}`,
      );
    });
  });

  describe("updateEndpoint", () => {
    it("should update an endpoint successfully", async () => {
      const result = await updateEndpoint(sampleEndpoint);
      expect(result).toEqual(sampleEndpoint);
    });

    it("should throw an error if the response is not ok", async () => {
      const statusCode = 500;
      const statusText = "Internal Server Error";
      server.use(
        http.put(
          "*/endpoint",
          async () =>
            new HttpResponse(null, { status: statusCode, statusText }),
        ),
      );
      await expect(updateEndpoint(sampleEndpoint)).rejects.toThrow(
        `An error occurred while updating endpoint: ${statusCode} ${statusText}`,
      );
    });
  });
});
