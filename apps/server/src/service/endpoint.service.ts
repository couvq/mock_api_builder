import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { EndpointRepository } from '../repository/endpoint.repository.js';
import type { EndpointConfig } from '@mock-api-builder/schema/dist/dto/endpoint/config.js';
import {
  CreateEndpointRequestSchema,
  type CreateEndpointRequest,
} from '@mock-api-builder/schema/dist/dto/endpoint/index.js';

@Injectable()
export class EndpointService {
  constructor(private readonly endpointRepository: EndpointRepository) {}

  getAllEndpoints(): EndpointConfig[] {
    return this.endpointRepository.getAllEndpoints();
  }

  getEndpointById(id: string): EndpointConfig | undefined {
    if (!id) throw new BadRequestException('No id provided in request.');
    return this.endpointRepository.getEndpointById(id);
  }

  addEndpoint(createEndpointRequest: CreateEndpointRequest) {
    const parsedRequest = CreateEndpointRequestSchema.safeParse(
      createEndpointRequest,
    );

    const { success, data, error } = parsedRequest;

    if (!success)
      throw new BadRequestException(error.message);

    if (
      this.endpointRepository.hasEndpoint(
        data.method,
        data.path,
      )
    )
      throw new ConflictException(
        'Endpoint with method and path already exist.',
      );

    const requestWithId = { ...data, id: crypto.randomUUID() };
    this.endpointRepository.addEndpoint(requestWithId);
  }
}
