import type {
  CreateEndpointRequest,
  CreateEndpointResponse,
  EndpointConfig,
  UpdateEndpointRequest,
  UpdateEndpointResponse,
} from '@mock-api-builder/schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RESOURCES } from '../constants.js';
import { EndpointService } from '../service/endpoint.service.js';

@Controller(RESOURCES.ENDPOINT)
export class EndpointController {
  constructor(private readonly endpointService: EndpointService) {}

  @Get()
  async getAllEndpoints(): Promise<EndpointConfig[]> {
    return await this.endpointService.getAllEndpoints();
  }

  @Get(':id')
  async getEndpointById(
    @Param('id') id: string,
  ): Promise<EndpointConfig | undefined> {
    return await this.endpointService.getEndpointById(id);
  }

  @Post()
  async addEndpoint(
    @Body() createEndpointRequest: CreateEndpointRequest,
  ): Promise<CreateEndpointResponse | undefined> {
    return await this.endpointService.addEndpoint(createEndpointRequest);
  }

  @Put()
  async updateEndpoint(
    @Body() updateEndpointRequest: UpdateEndpointRequest,
  ): Promise<UpdateEndpointResponse | undefined> {
    return await this.endpointService.updateEndpoint(updateEndpointRequest);
  }

  @Delete(':id')
  async deleteEndpointById(@Param('id') id: string) {
    return await this.endpointService.deleteEndpointById(id);
  }
}
