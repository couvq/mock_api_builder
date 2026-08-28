import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EndpointService } from '../service/endpoint.service.js';
import { RESOURCES } from '../constants.js';
import type { EndpointConfig } from '@mock-api-builder/schema';
import type { CreateEndpointRequest } from '@mock-api-builder/schema';

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
  addEndpoint(@Body() createEndpointRequest: CreateEndpointRequest) {
    this.endpointService.addEndpoint(createEndpointRequest);
  }
}
