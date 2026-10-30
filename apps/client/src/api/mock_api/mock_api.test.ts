import { http, HttpResponse } from "msw";
import { serveMockRequest, type ServeMockRequestPayload } from ".";
import { sampleMockApiResponse, server } from "../../test/server";

const MOCK_API_REQUEST: ServeMockRequestPayload = {
  method: "GET",
  path: "friend",
};

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("mock api tests", () => {
  it("should perform a mock API request", async () => {
    const response = await serveMockRequest(MOCK_API_REQUEST);
    expect(response).toEqual(sampleMockApiResponse);
  });

  it("should handle a failed mock API request", async () => {
    const statusCode = 500;
    const statusText = "Internal Server Error";
    server.use(
      http.get(
        "*/mock_api/*",
        async () => new HttpResponse(null, { status: statusCode, statusText }),
      ),
    );
    await expect(serveMockRequest(MOCK_API_REQUEST)).rejects.toThrow(
      `An error occurred calling mock endpoint: ${statusCode} ${statusText}`,
    );
  });
});
