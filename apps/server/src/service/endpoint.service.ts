import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EndpointRepository } from '../repository/endpoint.repository.js';
import type {
  CreateEndpointResponse,
  EndpointConfig,
  UpdateEndpointResponse,
} from '@mock-api-builder/schema';
import {
  CreateEndpointRequestSchema,
  UpdateEndpointRequest,
  UpdateEndpointRequestSchema,
  type CreateEndpointRequest,
} from '@mock-api-builder/schema';

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

  addEndpoint(
    createEndpointRequest: CreateEndpointRequest,
  ): CreateEndpointResponse {
    const { success, data, error } = CreateEndpointRequestSchema.safeParse(
      createEndpointRequest,
    );

    if (!success) throw new BadRequestException(error.message);

    if (this.endpointRepository.hasEndpoint(data.method, data.path))
      throw new ConflictException(
        'Endpoint with method and path already exist.',
      );

    const requestWithId = { ...data, id: crypto.randomUUID() };
    return this.endpointRepository.addEndpoint(requestWithId);
  }

  updateEndpoint(
    updateEndpointRequest: UpdateEndpointRequest,
  ): UpdateEndpointResponse {
    const { success, data, error } = UpdateEndpointRequestSchema.safeParse(
      updateEndpointRequest,
    );

    if (!success) throw new BadRequestException(error.message);

    if (!this.endpointRepository.hasEndpointWithId(data.id))
      throw new NotFoundException('Could not find endpoint with provided id.');

    return this.endpointRepository.updateEndpoint(data);
  }
}
