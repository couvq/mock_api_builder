import { Injectable } from '@nestjs/common';
import { EndpointRepository } from '../repository/endpoint.repository.js';
import type { EndpointConfig } from '@mock-api-builder/schema/dist/config.js';

@Injectable()
export class EndpointService {
  constructor(private readonly endpointRepository: EndpointRepository) { }

  getAllEndpoints(): EndpointConfig[] {
    return this.endpointRepository.getAllEndpoints();
  }

  addEndpoint(endpoint: EndpointConfig) {
    this.endpointRepository.addEndpoint(endpoint)
  }
}
