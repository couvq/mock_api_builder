import { Test, TestingModule } from '@nestjs/testing';
import { EndpointRepository } from '../repository/endpoint.repository.js';
import { EndpointService } from '../service/endpoint.service.js';
import { EndpointController } from './endpoint.controller.js';

describe('EndpointController', () => {
  let endpointController: EndpointController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EndpointController],
      providers: [EndpointService, EndpointRepository],
    }).compile();

    endpointController = app.get<EndpointController>(EndpointController);
  });

  describe('root', () => {
    it('should return empty array of endpoints initially', () => {
      expect(endpointController.getAllEndpoints()).toEqual([]);
    });

    it('should create an endpoint', () => {
      endpointController.addEndpoint({
        method: 'GET',
        path: 'test',
        responseSchema: {},
      });

      const allEndpoints = endpointController.getAllEndpoints();
      expect(allEndpoints.length).toBe(1);
      const endpoint = allEndpoints[0]
      const endpointId = endpoint.id;

      const matchingEndpoint = endpointController.getEndpointById(endpointId)
      expect(matchingEndpoint).toEqual(endpoint)
    });
  });
});
