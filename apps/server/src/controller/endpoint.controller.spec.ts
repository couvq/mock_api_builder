import { Test, TestingModule } from '@nestjs/testing';
import { EndpointRepository } from '../repository/endpoint.repository.js';
import { EndpointService } from '../service/endpoint.service.js';
import { EndpointController } from './endpoint.controller.js';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { CreateEndpointRequest } from '@mock-api-builder/schema';

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
      const endpoint = allEndpoints[0];
      const endpointId = endpoint.id;

      const matchingEndpoint = endpointController.getEndpointById(endpointId);
      expect(matchingEndpoint).toEqual(endpoint);
    });

    it('should throw bad request exception if no id provided to get by id', () => {
      // @ts-ignore
      expect(() => endpointController.getEndpointById(undefined)).toThrow(
        BadRequestException,
      );
    });

    it('should throw bad request exception if trying to create endpoint with invalid schema', () => {
      const invalidSchema = {
        responseSchema: {},
      };

      // @ts-ignore
      expect(() => endpointController.addEndpoint(invalidSchema)).toThrow(
        BadRequestException,
      );
    });

    it('should throw conflict exception if trying to create endpoint that already exists with the given method and path', () => {
      const testEndpoint: CreateEndpointRequest = {
        method: 'GET',
        path: 'test',
        responseSchema: {},
      }

      endpointController.addEndpoint(testEndpoint);

      expect(() => endpointController.addEndpoint(testEndpoint)).toThrow(ConflictException)
    });
  });
});
