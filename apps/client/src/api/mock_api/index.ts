import type {
  EndpointConfig,
  TranspiledSchema,
} from "@mock-api-builder/schema";

const mockApiBaseUrl = "/v1/api/mock_api";

export type ServeMockRequestPayload = Pick<EndpointConfig, "method" | "path">;

export type WithResponseStats<T> = {
  data: T | null;
  status: number;
  statusText: string;
  timeMs: number;
  sizeBytes: number;
};

export class MockRequestError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(status: number, statusText: string) {
    super(`An error occurred calling mock endpoint: ${status} ${statusText}`);
    this.name = "MockRequestError";
    this.status = status;
    this.statusText = statusText;
  }
}

export const serveMockRequest = async (
  payload: ServeMockRequestPayload,
): Promise<WithResponseStats<TranspiledSchema>> => {
  const startTime = performance.now();
  const response = await fetch(`${mockApiBaseUrl}/${payload.path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: payload.method,
    // Mock responses are edited on the fly and some status codes (404, 410, …)
    // are cacheable by default, so bypass the browser HTTP cache to always
    // reflect the endpoint's current configuration.
    cache: "no-store",
  });
  const endTime = performance.now();

  if (!response.ok) {
    throw new MockRequestError(response.status, response.statusText);
  }

  const rawText = await response.text();
  const data = JSON.parse(rawText) as TranspiledSchema;
  const timeMs = Math.round(endTime - startTime);
  const sizeBytes = new TextEncoder().encode(rawText).length;

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    timeMs,
    sizeBytes,
  };
};
