import type { EndpointConfig } from "@mock-api-builder/schema";

const endpointBaseUrl = "/v1/api/endpoint";

export const getAllEndpoints = async (): Promise<EndpointConfig[]> => {
  const response = await fetch(endpointBaseUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch endpoints: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as EndpointConfig[];
};

export const updateEndpoint = async (
  newEndpointConfiguration: EndpointConfig,
): Promise<EndpointConfig> => {
  const response = await fetch(endpointBaseUrl, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(newEndpointConfiguration),
  });

  if (!response.ok) {
    throw new Error(
      `An error occurred while updating endpoint: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as EndpointConfig;
};
