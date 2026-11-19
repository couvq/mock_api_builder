import { Test, TestingModule } from '@nestjs/testing';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { NotFoundException } from '@nestjs/common';
import { EndpointRepository } from '../repository/endpoint.repository.js';
import { MockApiService } from '../service/mock_api.service.js';
import { MockApiController } from './mock_api.controller.js';
import { db, endpointTable } from '../clients/endpointDbClient.js';
import type { EndpointConfig } from '@mock-api-builder/schema';

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

  it('should serve the transpiled response for a matching endpoint', async () => {
    const responseSchema = { message: 'hello', count: 5, active: true };
    const endpoint: EndpointConfig = {
      id: crypto.randomUUID(),
      method: 'GET',
      path: 'users/1',
      delay: 0,
      responseSchema,
    };
    await db.insert(endpointTable).values(endpoint);

    const req = { method: 'GET' } as unknown as Request;
    const result = await mockApiController.handleMockRequest(
      ['users', '1'],
      req,
    );

    // The schema has no faker tokens, so transpile returns it unchanged.
    expect(result).toEqual(responseSchema);
  });

  it('should throw not found exception when no endpoint matches the request', async () => {
    const req = { method: 'GET' } as unknown as Request;

    await expect(
      mockApiController.handleMockRequest(['does', 'not', 'exist'], req),
    ).rejects.toThrow(NotFoundException);
  });
});
