import type {
  EndpointConfig,
  TranspiledSchema,
} from "@mock-api-builder/schema";

const mockApiBaseUrl = "/v1/api/mock_api";

export type ServeMockRequestPayload = Pick<EndpointConfig, "method" | "path">;

export type WithResponseStats<T> = {
  response: T;
  status: number;
  responseTimeMs: number;
  responseSizeBytes: number;
};

export const serveMockRequest = async (
  payload: ServeMockRequestPayload,
): Promise<WithResponseStats<TranspiledSchema>> => {
  const startTime = performance.now();
  const response = await fetch(`${mockApiBaseUrl}/${payload.path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: payload.method,
  });

  if (!response.ok)
    throw new Error(
      `An error occurred calling mock endpoint: ${response.status} ${response.statusText}`,
    );

  const rawText = await response.text();
  const data = JSON.parse(rawText) as TranspiledSchema;
  const endTime = performance.now();
  const responseTimeMs = Math.round(endTime - startTime);
  const responseSizeBytes = new TextEncoder().encode(rawText).length;

  return {
    response: data,
    status: response.status,
    responseTimeMs,
    responseSizeBytes,
  };
};
