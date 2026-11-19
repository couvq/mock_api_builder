import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EndpointRepository } from '../repository/endpoint.repository.js';
import {
  EndpointConfig,
  transpile,
  TranspiledSchema,
} from '@mock-api-builder/schema';

const delay = (timeMs: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, timeMs));
};

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

    if (!matchingEndpoint) {
      this.logger.error('serveMock failed: no matching endpoint', {
        method,
        path,
      });
      throw new NotFoundException(
        `Endpoint does not exist for method: ${method} and path: ${path}`,
      );
    }

    await delay(matchingEndpoint.delay);

    const { responseSchema } = matchingEndpoint;
    return transpile(responseSchema);
  }
}
