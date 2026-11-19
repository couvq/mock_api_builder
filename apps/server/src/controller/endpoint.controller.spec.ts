import { Test, TestingModule } from '@nestjs/testing';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { EndpointRepository } from '../repository/endpoint.repository.js';
import { EndpointService } from '../service/endpoint.service.js';
import { EndpointController } from './endpoint.controller.js';
import { db, endpointTable } from '../clients/endpointDbClient.js';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateEndpointRequest,
  UpdateEndpointRequest,
} from '@mock-api-builder/schema';

describe('EndpointController', () => {
  let endpointController: EndpointController;

  // Runs once for the whole file: creates the table in the test database.
  beforeAll(() => {
    migrate(db, { migrationsFolder: './drizzle' });
  });

  beforeEach(async () => {
    // Clear all rows so every test starts from an empty table
    await db.delete(endpointTable);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [EndpointController],
      providers: [EndpointService, EndpointRepository],
    }).compile();

    endpointController = app.get<EndpointController>(EndpointController);
  });

  describe('root', () => {
    it('should return empty array of endpoints initially', async () => {
      expect((await endpointController.getAllEndpoints()).length).toBe(0);
    });

    it('should create an endpoint', async () => {
      expect((await endpointController.getAllEndpoints()).length).toBe(0);
      const testEndpoint: CreateEndpointRequest = {
        method: 'GET',
        path: 'test',
        delay: 0,
        responseSchema: {},
      };
      const createdEndpoint =
        await endpointController.addEndpoint(testEndpoint);
      expect((await endpointController.getAllEndpoints()).length).toBe(1);
      expect(
        // @ts-ignore
        await endpointController.getEndpointById(createdEndpoint?.id),
      ).toBeDefined();
    });

    it('should throw bad request exception if no id provided to get by id', async () => {
      // @ts-ignore
      expect(endpointController.getEndpointById(undefined)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw not found exception if id passed to get by id not found in storage', async () => {
      expect(
        endpointController.getEndpointById('non_existent_id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw bad request exception if trying to create endpoint with invalid schema', async () => {
      const invalidSchema = {
        responseSchema: {},
      };

      //@ts-ignore
      expect(endpointController.addEndpoint(invalidSchema)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw conflict exception if trying to create endpoint that already exists with the given method and path', async () => {
      const testEndpoint: CreateEndpointRequest = {
        method: 'GET',
        path: 'test',
        delay: 0,
        responseSchema: {},
      };

      await endpointController.addEndpoint(testEndpoint);

      expect(endpointController.addEndpoint(testEndpoint)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw internal server error exception if repository returns no endpoint', async () => {
      // Mock the repository so the create "succeeds" past the conflict check
      // but the insert read-back returns nothing, forcing the service's
      // InternalServerErrorException branch.
      const mockEndpointRepository = {
        hasEndpoint: vi.fn().mockResolvedValue(false),
        addEndpoint: vi.fn().mockResolvedValue(undefined),
      };

      const app: TestingModule = await Test.createTestingModule({
        controllers: [EndpointController],
        providers: [EndpointService, EndpointRepository],
      })
        .overrideProvider(EndpointRepository)
        .useValue(mockEndpointRepository)
        .compile();

      const controller = app.get<EndpointController>(EndpointController);

      const testEndpoint: CreateEndpointRequest = {
        method: 'GET',
        path: 'test',
        delay: 0,
        responseSchema: {},
      };

      await expect(controller.addEndpoint(testEndpoint)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw internal server error exception if repository returns no endpoint on update', async () => {
      // Mock the repository so the update passes the existence check but the
      // update read-back returns nothing, forcing the service's
      // InternalServerErrorException branch.
      const mockEndpointRepository = {
        hasEndpointWithId: vi.fn().mockResolvedValue(true),
        updateEndpoint: vi.fn().mockResolvedValue(undefined),
      };

      const app: TestingModule = await Test.createTestingModule({
        controllers: [EndpointController],
        providers: [EndpointService, EndpointRepository],
      })
        .overrideProvider(EndpointRepository)
        .useValue(mockEndpointRepository)
        .compile();

      const controller = app.get<EndpointController>(EndpointController);

      const testUpdateEndpoint: UpdateEndpointRequest = {
        id: 'test',
        method: 'GET',
        path: 'test',
        delay: 0,
        responseSchema: {},
      };

      await expect(
        controller.updateEndpoint(testUpdateEndpoint),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw bad request exception if trying to pass invalid schema to update endpoint', async () => {
      const invalidSchema = {
        responseSchema: {},
      };

      // @ts-ignore
      expect(endpointController.updateEndpoint(invalidSchema)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw not found if trying to pass endpoint that does not exist to update endpoint', async () => {
      expect((await endpointController.getAllEndpoints()).length).toBe(0);
      expect(
        endpointController.updateEndpoint({
          id: 'test',
          method: 'GET',
          path: 'test',
          delay: 0,
          responseSchema: {},
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update endpoint', async () => {
      expect((await endpointController.getAllEndpoints()).length).toBe(0);
      const createEndpointRequest: CreateEndpointRequest = {
        method: 'GET',
        path: 'test',
        delay: 0,
        responseSchema: {},
      };

      const createdEndpoint = await endpointController.addEndpoint(
        createEndpointRequest,
      );
      expect((await endpointController.getAllEndpoints()).length).toBe(1);
      expect(createdEndpoint?.path).toBe('test');

      const testUpdateEndpointRequest: UpdateEndpointRequest = {
        // @ts-ignore
        id: createdEndpoint?.id,
        method: 'GET',
        path: 'updated_path',
        delay: 0,
        responseSchema: {},
      };
      const updatedEndpoint = await endpointController.updateEndpoint(
        testUpdateEndpointRequest,
      );
      expect((await endpointController.getAllEndpoints()).length).toBe(1);
      expect(updatedEndpoint?.path).toBe('updated_path');
    });
  });

  it('should throw bad request exception if no id is passed to delete by id handler', async () => {
    // @ts-ignore
    expect(endpointController.deleteEndpointById(undefined)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw not found exception if no matching id found in storage for delete by id handler', async () => {
    expect(
      endpointController.deleteEndpointById('nonexistent_id'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete endpoint by id', async () => {
    expect(await endpointController.getAllEndpoints()).toHaveLength(0);
    const createdEndpoint = await endpointController.addEndpoint({
      method: 'GET',
      path: 'test',
      responseSchema: {},
      delay: 0,
    });
    expect(await endpointController.getAllEndpoints()).toHaveLength(1);

    // @ts-ignore
    await endpointController.deleteEndpointById(createdEndpoint?.id);
    expect(await endpointController.getAllEndpoints()).toHaveLength(0);
  });
});
