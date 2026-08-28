import { Injectable } from '@nestjs/common';

@Injectable()
export class EndpointRepository {
  private endpoints: any[] = [];

  constructor() {
    // Initialize with some sample endpoints
    this.endpoints = [
      { id: 1, name: 'Endpoint 1', url: '/api/endpoint1' },
      { id: 2, name: 'Endpoint 2', url: '/api/endpoint2' },
      { id: 3, name: 'Endpoint 3', url: '/api/endpoint3' },
    ];
  }

  getAllEndpoints(): any[] {
    return this.endpoints;
  }
}