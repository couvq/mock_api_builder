import { Body, Controller, Get, Post } from '@nestjs/common';
import { EndpointService } from '../service/endpoint.service.js';
import { RESOURCES } from '../constants.js';
import type { EndpointConfig } from '@mock-api-builder/schema/dist/config.js'

@Controller(RESOURCES.ENDPOINT)
export class EndpointController {
  constructor(private readonly endpointService: EndpointService) { }

  @Get()
  getAllEndpoints(): EndpointConfig[] {
    return this.endpointService.getAllEndpoints();
  }

  @Post()
  addEndpoint(@Body() endpointConfig: EndpointConfig) {
    this.endpointService.addEndpoint(endpointConfig)
  }
}
