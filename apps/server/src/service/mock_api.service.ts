import { Injectable, NotFoundException } from '@nestjs/common';
import { EndpointRepository } from '../repository/endpoint.repository.js';
import {
  EndpointConfig,
  transpile,
  TranspiledSchema,
} from '@mock-api-builder/schema';

@Injectable()
export class MockApiService {
  constructor(private readonly endpointRepository: EndpointRepository) {}

  async serveMock(
    method: EndpointConfig['method'],
    path: EndpointConfig['path'],
  ): Promise<TranspiledSchema> {
    const matchingEndpoint =
      await this.endpointRepository.getEndpointByMethodAndPath(method, path);

    if (!matchingEndpoint)
      throw new NotFoundException('Endpoint does not exist.');

    const { responseSchema } = matchingEndpoint;
    return transpile(responseSchema);
  }
}
