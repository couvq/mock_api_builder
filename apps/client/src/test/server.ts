import type { EndpointConfig } from "@mock-api-builder/schema/dist/dto/endpoint/config";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const sampleEndpoint: EndpointConfig = {
  id: "123",
  method: "GET",
  path: "friend",
  responseSchema: {},
};

export const sampleMockApiResponse = {
  friends: [],
};

export const server = setupServer(
  http.get("*/endpoint", async () => HttpResponse.json([sampleEndpoint])),
  http.put("*/endpoint", async ({ request }) =>
    HttpResponse.json(await request.json()),
  ),
  http.get("*/mock_api/*", async () => HttpResponse.json(sampleMockApiResponse)),
);
