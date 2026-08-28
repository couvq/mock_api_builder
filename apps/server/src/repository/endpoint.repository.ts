import type { EndpointConfig } from '@mock-api-builder/schema/dist/config.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EndpointRepository {
  private endpoints: Map<string, EndpointConfig>;

  constructor() {
    this.endpoints = new Map<string, EndpointConfig>([
      [
        'GET:users',
        {
          method: 'GET',
          path: 'endpoint',
          responseSchema: {},
        },
      ],
    ]);
  }

  getAllEndpoints(): EndpointConfig[] {
    return Array.from(this.endpoints.values());
  }
}