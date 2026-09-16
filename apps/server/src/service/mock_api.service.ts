import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EndpointRepository } from '../repository/endpoint.repository.js';
import {
  EndpointConfig,
  transpile,
  TranspiledSchema,
} from '@mock-api-builder/schema';

@Injectable()
export class MockApiService {
  private readonly logger = new Logger(MockApiService.name);

  constructor(private readonly endpointRepository: EndpointRepository) {}

  async serveMock(
    method: EndpointConfig['method'],
    path: EndpointConfig['path'],
  ): Promise<TranspiledSchema> {
    this.logger.log('Mock request received', { method, path });
    const matchingEndpoint =
      await this.endpointRepository.getEndpointByMethodAndPath(method, path);

    if (!matchingEndpoint)
      throw new NotFoundException(`Endpoint does not exist for method: ${method} and path: ${path}`);

    const { responseSchema } = matchingEndpoint;
    return transpile(responseSchema);
  }
}
