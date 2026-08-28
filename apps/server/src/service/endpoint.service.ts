import { Injectable } from '@nestjs/common';
import { EndpointRepository } from '../repository/endpoint.repository.js';

@Injectable()
export class EndpointService {
  constructor(private readonly endpointRepository: EndpointRepository) {}

  getAllEndpoints(): any[] {
    return this.endpointRepository.getAllEndpoints();
  }
}
