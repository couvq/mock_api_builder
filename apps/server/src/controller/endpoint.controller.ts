import { Controller, Get } from '@nestjs/common';
import { EndpointService } from '../service/endpoint.service.js';
import { RESOURCES } from '../constants.js';
import type { EndpointConfig } from '@mock-api-builder/schema/dist/config.js'

@Controller()
export class EndpointController {
  constructor(private readonly endpointService: EndpointService) { }

  @Get(RESOURCES.ENDPOINT)
  getAllEndpoints(): EndpointConfig[] {
    return this.endpointService.getAllEndpoints();
  }
}
