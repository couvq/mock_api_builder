import { Injectable } from '@nestjs/common';
import { EndpointRepository } from '../repository/endpoint.repository.js';
import type { EndpointConfig } from '@mock-api-builder/schema/dist/dto/endpoint/config.js';
import type { CreateEndpointRequest } from '@mock-api-builder/schema/dist/dto/endpoint/index.js';

@Injectable()
export class EndpointService {
  constructor(private readonly endpointRepository: EndpointRepository) { }

  getAllEndpoints(): EndpointConfig[] {
    return this.endpointRepository.getAllEndpoints();
  }

  addEndpoint(createEndpointRequest: CreateEndpointRequest) {
    const requestWithId = { ...createEndpointRequest, id: crypto.randomUUID() };
    this.endpointRepository.addEndpoint(requestWithId);
  }
}
