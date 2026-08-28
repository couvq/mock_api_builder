import { Test, TestingModule } from '@nestjs/testing';
import { EndpointRepository } from '../repository/endpoint.repository.js';
import { EndpointService } from '../service/endpoint.service.js';
import { EndpointController } from './endpoint.controller.js';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateEndpointRequest,
  UpdateEndpointRequest,
} from '@mock-api-builder/schema';

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
      expect(endpointController.getAllEndpoints().length).toBe(0);
      expect(endpointController.getAllEndpoints()).toEqual([]);
    });

    it('should create an endpoint', () => {
      expect(endpointController.getAllEndpoints().length).toBe(0);
      const testEndpoint: CreateEndpointRequest = {
        method: 'GET',
        path: 'test',
        responseSchema: {},
      };
      const createdEndpoint = endpointController.addEndpoint(testEndpoint);
      expect(endpointController.getAllEndpoints().length).toBe(1);
      expect(
        endpointController.getEndpointById(createdEndpoint.id),
      ).toBeDefined();
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
      };

      endpointController.addEndpoint(testEndpoint);

      expect(() => endpointController.addEndpoint(testEndpoint)).toThrow(
        ConflictException,
      );
    });

    it('should throw bad request exception if trying to pass invalid schema to update endpoint', () => {
      const invalidSchema = {
        responseSchema: {},
      };

      // @ts-ignore
      expect(() => endpointController.updateEndpoint(invalidSchema)).toThrow(
        BadRequestException,
      );
    });

    it('should throw not found if trying to pass endpoint that does not exist to update endpoint', () => {
      expect(endpointController.getAllEndpoints().length).toBe(0);
      expect(() =>
        endpointController.updateEndpoint({
          id: 'test',
          method: 'GET',
          path: 'test',
          responseSchema: {},
        }),
      ).toThrow(NotFoundException);
    });

    it('should update endpoint', () => {
      expect(endpointController.getAllEndpoints().length).toBe(0);
      const createEndpointRequest: CreateEndpointRequest = {
        method: 'GET',
        path: 'test',
        responseSchema: {},
      };

      const createdEndpoint = endpointController.addEndpoint(
        createEndpointRequest,
      );
      expect(endpointController.getAllEndpoints().length).toBe(1);
      expect(createdEndpoint.path).toBe('test');

      const testUpdateEndpointRequest: UpdateEndpointRequest = {
        id: createdEndpoint.id,
        method: 'GET',
        path: 'updated_path',
        responseSchema: {},
      };
      const updatedEndpoint = endpointController.updateEndpoint(
        testUpdateEndpointRequest,
      );
      expect(endpointController.getAllEndpoints().length).toBe(1);
      expect(updatedEndpoint.path).toBe('updated_path');
    });
  });
});
