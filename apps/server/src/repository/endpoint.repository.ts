import type { EndpointConfig } from '@mock-api-builder/schema/dist/config.js';
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

  addEndpoint(endpoint: EndpointConfig) {
    const key = `${endpoint.method}:${endpoint.path}`
    this.endpoints.set(key, endpoint)
  }
}