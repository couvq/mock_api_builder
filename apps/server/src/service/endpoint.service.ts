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

  async getAllEndpoints(): Promise<EndpointConfig[]> {
    return await this.endpointRepository.getAllEndpoints();
  }

  async getEndpointById(id: string): Promise<EndpointConfig | undefined> {
    if (!id) throw new BadRequestException('No id provided in request.');

    if (!await this.endpointRepository.hasEndpointWithId(id))
      throw new NotFoundException('Endpoint with id does not exist.');

    return await this.endpointRepository.getEndpointById(id);
  }

  async addEndpoint(
    createEndpointRequest: CreateEndpointRequest,
  ): Promise<CreateEndpointResponse | undefined> {
    const { success, data, error } = CreateEndpointRequestSchema.safeParse(
      createEndpointRequest,
    );

    if (!success) throw new BadRequestException(error.message);

    if (await this.endpointRepository.hasEndpoint(data.method, data.path))
      throw new ConflictException(
        'Endpoint with method and path already exist.',
      );

    const requestWithId = { ...data, id: crypto.randomUUID() };
    return await this.endpointRepository.addEndpoint(requestWithId);
  }

  async updateEndpoint(
    updateEndpointRequest: UpdateEndpointRequest,
  ): Promise<UpdateEndpointResponse | undefined> {
    const { success, data, error } = UpdateEndpointRequestSchema.safeParse(
      updateEndpointRequest,
    );

    if (!success) throw new BadRequestException(error.message);

    if (!await this.endpointRepository.hasEndpointWithId(data.id))
      throw new NotFoundException('Could not find endpoint with provided id.');

    return await this.endpointRepository.updateEndpoint(data);
  }

  async deleteEndpointById(id: string) {
    if (!id) throw new BadRequestException('No id provided in request.');

    if (!await this.endpointRepository.hasEndpointWithId(id))
      throw new NotFoundException('Could not find endpoint with provided id.');

    await this.endpointRepository.deleteEndpointById(id);
  }
}
