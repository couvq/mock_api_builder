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
    if (!(await this.endpointRepository.hasEndpoint(method, path)))
      throw new NotFoundException('Endpoint does not exist.');

    // TODO: not the most efficient, could either pass id to get it more efficiently or add another api for method + path querying efficiently
    const [matchingEndpoint] = (
      await this.endpointRepository.getAllEndpoints()
    ).filter(
      (endpoint) => endpoint.method === method && endpoint.path === path,
    );

    if (!matchingEndpoint)
      throw new NotFoundException('Endpoint does not exist.');

    const { responseSchema } = matchingEndpoint;
    return transpile(responseSchema);
  }
}
