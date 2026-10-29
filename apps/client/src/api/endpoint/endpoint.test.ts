import type { EndpointConfig } from "@mock-api-builder/schema";
import { getAllEndpoints } from ".";

describe("endpoint api tests", () => {
  describe("getAllEndpoints", () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
    });

    it("should return endpoint configs upon successful 200 response", async () => {
      const endpointConfigs: EndpointConfig[] = [
        { id: "123", method: "GET", path: "/example", responseSchema: {} },
      ];
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => endpointConfigs,
      });
      const result = await getAllEndpoints();
      expect(result).toEqual(endpointConfigs);
    });

    it("should throw an error if the response is not ok", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Internal Server Error" }),
      });
      await expect(getAllEndpoints()).rejects.toThrow();
    });
  });
});
