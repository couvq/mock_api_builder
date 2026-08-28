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
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { RESOURCES } from '../constants.js';
import { EndpointService } from '../service/endpoint.service.js';

@Controller(RESOURCES.ENDPOINT)
export class EndpointController {
  constructor(private readonly endpointService: EndpointService) {}

  @Get()
  getAllEndpoints(): EndpointConfig[] {
    return this.endpointService.getAllEndpoints();
  }

  @Get(':id')
  getEndpointById(@Param('id') id: string): EndpointConfig | undefined {
    return this.endpointService.getEndpointById(id);
  }

  @Post()
  addEndpoint(
    @Body() createEndpointRequest: CreateEndpointRequest,
  ): CreateEndpointResponse {
    return this.endpointService.addEndpoint(createEndpointRequest);
  }

  @Put()
  updateEndpoint(
    @Body() updateEndpointRequest: UpdateEndpointRequest,
  ): UpdateEndpointResponse {
    return this.endpointService.updateEndpoint(updateEndpointRequest);
  }
}
