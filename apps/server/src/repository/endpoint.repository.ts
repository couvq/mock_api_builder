import type { EndpointConfig } from '@mock-api-builder/schema/dist/dto/endpoint/config.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EndpointRepository {
  private endpoints: Map<string, EndpointConfig>;

  constructor() {
    this.endpoints = new Map<string, EndpointConfig>();
  }

  getAllEndpoints(): EndpointConfig[] {
    return Array.from(this.endpoints.values());
  }

  getEndpointById(id: string): EndpointConfig | undefined {
    return this.endpoints.get(id);
  }

  addEndpoint(endpoint: EndpointConfig): EndpointConfig {
    const { id } = endpoint;
    this.endpoints.set(id, endpoint);
    return this.endpoints.get(id) as EndpointConfig;
  }

  updateEndpoint(endpoint: EndpointConfig): EndpointConfig {
    const { id } = endpoint;
    this.endpoints.set(id, endpoint);
    return this.endpoints.get(id) as EndpointConfig;
  }

  hasEndpointWithId(id: string): boolean {
    return this.endpoints.has(id);
  }

  /**
   * Determines whether an endpoint with the specified method and path are currently stored.
   */
  hasEndpoint(method: string, path: string): boolean {
    return Array.from(this.endpoints.values()).some(
      (endpoint) => endpoint.method === method && endpoint.path === path,
    );
  }
}
