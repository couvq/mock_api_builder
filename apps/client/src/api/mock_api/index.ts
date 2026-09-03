import type {
  EndpointConfig,
  TranspiledSchema,
} from "@mock-api-builder/schema";

const mockApiBaseUrl = '/v1/api/mock_api';

export const serveMockRequest = async (
  payload: Pick<EndpointConfig, "method" | "path">,
): Promise<TranspiledSchema> => {
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

  return (await response.json()) as TranspiledSchema;
};
