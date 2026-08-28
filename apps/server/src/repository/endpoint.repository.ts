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

  addEndpoint(endpoint: EndpointConfig) {
    const { id } = endpoint;
    this.endpoints.set(id, endpoint);
  }
}
