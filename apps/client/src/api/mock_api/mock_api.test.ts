import { serveMockRequest, type ServeMockRequestPayload } from ".";

const MOCK_API_REQUEST: ServeMockRequestPayload = {
  method: "GET",
  path: "friends",
};

describe("mock api tests", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("should perform a mock API request", async () => {
    const expectedResponse = { data: [] };
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => expectedResponse,
    });
    const response = await serveMockRequest(MOCK_API_REQUEST);
    expect(response).toEqual(expectedResponse);
  });

  it("should handle a failed mock API request", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({ error: "Not Found" }),
    });
    await expect(serveMockRequest(MOCK_API_REQUEST)).rejects.toThrow('An error occurred calling mock endpoint: 404 Not Found');
  });
});
