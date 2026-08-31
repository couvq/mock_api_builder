import type { EndpointConfig } from "@mock-api-builder/schema";

export const getAllEndpoints = async (): Promise<EndpointConfig[]> => {
  const response = await fetch(`/endpoint`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch endpoints: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as EndpointConfig[];
};
