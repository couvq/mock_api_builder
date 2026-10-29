import type { EndpointConfig } from "@mock-api-builder/schema";
import { getAllEndpoints, updateEndpoint } from ".";

const sampleEndpoint: EndpointConfig = {
  id: "123",
  method: "GET",
  path: "/example",
  responseSchema: {},
};

describe("endpoint api tests", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  describe("getAllEndpoints", () => {
    it("should return endpoint configs upon successful 200 response", async () => {
      const endpointConfigs: EndpointConfig[] = [sampleEndpoint];
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => endpointConfigs,
      });
      const result = await getAllEndpoints();
      expect(result).toEqual(endpointConfigs);
    });

    it("should throw an error if the response is not ok", async () => {
      const statusText = "Internal Server Error";
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText,
      });
      await expect(getAllEndpoints()).rejects.toThrow(
        `Failed to fetch endpoints: 500 ${statusText}`,
      );
    });
  });

  describe("updateEndpoint", () => {
    it("should update an endpoint successfully", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => sampleEndpoint,
      });
      const result = await updateEndpoint(sampleEndpoint);
      expect(result).toEqual(sampleEndpoint);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sampleEndpoint),
        }),
      );
    });

    it("should throw an error if the response is not ok", async () => {
      const statusText = "Internal Server Error";
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText,
      });
      await expect(updateEndpoint(sampleEndpoint)).rejects.toThrow(
        `An error occurred while updating endpoint: 500 ${statusText}`,
      );
    });
  });
});
