import { http, HttpResponse } from "msw";
import {
  deleteEndpoint,
  getAllEndpoints,
  getEndpointById,
  updateEndpoint,
} from ".";
import { sampleEndpoint, server } from "../../test/server";

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

  describe("getEndpointById", () => {
    it("should return the matching endpoint config upon a successful 200 response", async () => {
      const result = await getEndpointById(sampleEndpoint.id);
      expect(result).toEqual(sampleEndpoint);
    });

    it("should throw an error if the response is not ok", async () => {
      const statusCode = 404;
      const statusText = "Not Found";
      server.use(
        http.get(
          "*/endpoint/:id",
          async () =>
            new HttpResponse(null, { status: statusCode, statusText }),
        ),
      );
      await expect(getEndpointById(sampleEndpoint.id)).rejects.toThrow(
        `Failed to fetch endpoint: ${statusCode} ${statusText}`,
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

  describe("deleteEndpoint", () => {
    it("should delete an endpoint successfully", async () => {
      await expect(deleteEndpoint(sampleEndpoint.id)).resolves.toBeUndefined();
    });

    it("should throw an error if the response is not ok", async () => {
      const statusCode = 500;
      const statusText = "Internal Server Error";
      server.use(
        http.delete(
          "*/endpoint/:id",
          async () =>
            new HttpResponse(null, { status: statusCode, statusText }),
        ),
      );
      await expect(deleteEndpoint(sampleEndpoint.id)).rejects.toThrow(
        `An error occurred while deleting endpoint: ${statusCode} ${statusText}`,
      );
    });
  });
});
