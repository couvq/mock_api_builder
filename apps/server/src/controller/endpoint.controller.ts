import { Controller, Get } from '@nestjs/common';
import { EndpointService } from '../service/endpoint.service.js';
import { RESOURCES } from '../constants.js';

@Controller()
export class EndpointController {
  constructor(private readonly endpointService: EndpointService) {}

  @Get(RESOURCES.ENDPOINT)
  getAllEndpoints(): any[] {
    return this.endpointService.getAllEndpoints();
  }
}
