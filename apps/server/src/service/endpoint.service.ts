import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
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
  private readonly logger = new Logger(EndpointService.name);

  constructor(private readonly endpointRepository: EndpointRepository) {}

  async getAllEndpoints(): Promise<EndpointConfig[]> {
    return await this.endpointRepository.getAllEndpoints();
  }

  async getEndpointById(id: string): Promise<EndpointConfig | undefined> {
    if (!id) {
      this.logger.error('getEndpointById failed: no id provided');
      throw new BadRequestException('No id provided in request.');
    }

    if (!(await this.endpointRepository.hasEndpointWithId(id))) {
      this.logger.error('getEndpointById failed: endpoint not found', { id });
      throw new NotFoundException('Endpoint with id does not exist.');
    }

    return await this.endpointRepository.getEndpointById(id);
  }

  async addEndpoint(
    createEndpointRequest: CreateEndpointRequest,
  ): Promise<CreateEndpointResponse | undefined> {
    const { success, data, error } = CreateEndpointRequestSchema.safeParse(
      createEndpointRequest,
    );

    if (!success) {
      this.logger.error('addEndpoint failed: invalid request schema', {
        error: error.message,
      });
      throw new BadRequestException(error.message);
    }

    if (await this.endpointRepository.hasEndpoint(data.method, data.path)) {
      this.logger.error('addEndpoint failed: endpoint already exists', {
        method: data.method,
        path: data.path,
      });
      throw new ConflictException(
        'Endpoint with method and path already exist.',
      );
    }

    const requestWithId = { ...data, id: crypto.randomUUID() };
    const createdEndpoint =
      await this.endpointRepository.addEndpoint(requestWithId);

    if (!createdEndpoint) {
      this.logger.error('addEndpoint failed: repository returned no endpoint', {
        method: data.method,
        path: data.path,
      });
      throw new InternalServerErrorException(
        `Failed to create endpoint with method: ${data.method} and path: ${data.path}`,
      );
    }

    this.logger.log('Endpoint created', {
      id: createdEndpoint.id,
      method: data.method,
      path: data.path,
    });
    return createdEndpoint;
  }

  async updateEndpoint(
    updateEndpointRequest: UpdateEndpointRequest,
  ): Promise<UpdateEndpointResponse | undefined> {
    const { success, data, error } = UpdateEndpointRequestSchema.safeParse(
      updateEndpointRequest,
    );

    if (!success) {
      this.logger.error('updateEndpoint failed: invalid request schema', {
        error: error.message,
      });
      throw new BadRequestException(error.message);
    }

    if (!(await this.endpointRepository.hasEndpointWithId(data.id))) {
      this.logger.error('updateEndpoint failed: endpoint not found', {
        id: data.id,
      });
      throw new NotFoundException('Could not find endpoint with provided id.');
    }

    const updatedEndpoint = await this.endpointRepository.updateEndpoint(data);
    if (!updatedEndpoint) {
      this.logger.error(
        'updateEndpoint failed: repository returned no endpoint',
        { id: data.id },
      );
      throw new InternalServerErrorException(
        `Failed to update endpoint with id: ${data.id}`,
      );
    }

    this.logger.log('Endpoint updated', {
      id: updatedEndpoint.id,
      method: updatedEndpoint.method,
      path: updatedEndpoint.path,
    });
    return updatedEndpoint;
  }

  async deleteEndpointById(id: string) {
    if (!id) {
      this.logger.error('deleteEndpointById failed: no id provided');
      throw new BadRequestException('No id provided in request.');
    }

    if (!(await this.endpointRepository.hasEndpointWithId(id))) {
      this.logger.error('deleteEndpointById failed: endpoint not found', {
        id,
      });
      throw new NotFoundException('Could not find endpoint with provided id.');
    }

    await this.endpointRepository.deleteEndpointById(id);
    this.logger.log('Endpoint deleted', { id });
  }
}
