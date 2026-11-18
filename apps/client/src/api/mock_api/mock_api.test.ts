import { http, HttpResponse } from "msw";
import {
  MockRequestError,
  serveMockRequest,
  type ServeMockRequestPayload,
} from ".";
import { sampleMockApiResponse, server } from "../../test/server";

const MOCK_API_REQUEST: ServeMockRequestPayload = {
  method: "GET",
  path: "friend",
};

describe("mock api tests", () => {
  it("should perform a mock API request", async () => {
    const response = await serveMockRequest(MOCK_API_REQUEST);
    expect(response.data).toEqual(sampleMockApiResponse);
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
    const error = await serveMockRequest(MOCK_API_REQUEST).catch(
      (e: unknown) => e,
    );

    expect(error).toBeInstanceOf(MockRequestError);
    expect(error).toMatchObject({ status: statusCode, statusText });
  });
});
