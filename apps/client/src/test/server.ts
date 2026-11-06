import type { EndpointConfig } from "@mock-api-builder/schema";
import { delay, http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const sampleEndpoint: EndpointConfig = {
  id: "123",
  method: "GET",
  path: "friend",
  responseSchema: {
    friends: [],
  },
};

export const sampleMockApiResponse = {
  friends: ["John", "Jane"],
};

export const server = setupServer(
  http.get("*/endpoint", async () => {
    await delay(50);
    return HttpResponse.json([sampleEndpoint]);
  }),
  http.put("*/endpoint", async ({ request }) => {
    await delay(50);
    return HttpResponse.json(await request.json());
  }),
  http.post("*/endpoint", async ({ request }) => {
    await delay(50);
    return HttpResponse.json(await request.json());
  }),
  http.delete("*/endpoint/:id", async () => {
    await delay(50);
    return HttpResponse.json(
      { message: "Endpoint deleted successfully" },
      { status: 200 },
    );
  }),
  http.get("*/mock_api/*", async () => {
    await delay(50);
    return HttpResponse.json(sampleMockApiResponse);
  }),
);
