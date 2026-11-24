import { Test, TestingModule } from '@nestjs/testing';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { NotFoundException } from '@nestjs/common';
import { EndpointRepository } from '../repository/endpoint.repository.js';
import { MockApiService } from '../service/mock_api.service.js';
import { MockApiController } from './mock_api.controller.js';
import { db, endpointTable } from '../clients/endpointDbClient.js';
import type { EndpointConfig } from '@mock-api-builder/schema';
import type { Request, Response } from 'express';

describe('MockApiController', () => {
  let mockApiController: MockApiController;

  // Runs once for the whole file: creates the table in the test database.
  beforeAll(() => {
    migrate(db, { migrationsFolder: './drizzle' });
  });

  beforeEach(async () => {
    // Clear all rows so every test starts from an empty table
    await db.delete(endpointTable);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [MockApiController],
      providers: [MockApiService, EndpointRepository],
    }).compile();

    mockApiController = app.get<MockApiController>(MockApiController);
  });

  it('should serve the transpiled response and set the configured status code', async () => {
    const responseSchema = { message: 'hello', count: 5, active: true };
    const endpoint: EndpointConfig = {
      id: crypto.randomUUID(),
      method: 'GET',
      path: 'users/1',
      statusCode: 201,
      delay: 0,
      responseSchema,
    };
    await db.insert(endpointTable).values(endpoint);

    const req = { method: 'GET' } as unknown as Request;
    const res = { status: vi.fn(), set: vi.fn() } as unknown as Response;
    const result = await mockApiController.handleMockRequest(
      ['users', '1'],
      req,
      res,
    );

    // The schema has no faker tokens, so transpile returns it unchanged.
    expect(result).toEqual(responseSchema);
    // The endpoint's configured status code is applied dynamically.
    expect(res.status).toHaveBeenCalledWith(201);
    // Mock responses are marked non-cacheable so clients never replay a stale
    // (and cacheable-by-default) status like 404/410.
    expect(res.set).toHaveBeenCalledWith('Cache-Control', 'no-store');
  });

  it('should throw not found exception when no endpoint matches the request', async () => {
    const req = { method: 'GET' } as unknown as Request;
    const res = { status: vi.fn(), set: vi.fn() } as unknown as Response;

    await expect(
      mockApiController.handleMockRequest(['does', 'not', 'exist'], req, res),
    ).rejects.toThrow(NotFoundException);
  });
});
