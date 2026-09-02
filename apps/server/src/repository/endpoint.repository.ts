import type { EndpointConfig } from '@mock-api-builder/schema';
import { Injectable } from '@nestjs/common';
import { db, endpointTable } from '../clients/endpointDbClient.js';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class EndpointRepository {
  async getAllEndpoints(): Promise<EndpointConfig[]> {
    return await db.select().from(endpointTable);
  }

  async getEndpointById(id: string): Promise<EndpointConfig | undefined> {
    const res = await db
      .select()
      .from(endpointTable)
      .where(eq(endpointTable.id, id));
    return res.at(0);
  }

  async addEndpoint(
    endpoint: EndpointConfig,
  ): Promise<EndpointConfig | undefined> {
    await db.insert(endpointTable).values(endpoint);
    const createdEndpoint = await db
      .select()
      .from(endpointTable)
      .where(eq(endpointTable.id, endpoint.id));
    return createdEndpoint.at(0);
  }

  async updateEndpoint(
    endpoint: EndpointConfig,
  ): Promise<EndpointConfig | undefined> {
    await db
      .update(endpointTable)
      .set(endpoint)
      .where(eq(endpointTable.id, endpoint.id));
    const updatedEndpoint = await db
      .select()
      .from(endpointTable)
      .where(eq(endpointTable.id, endpoint.id));
    return updatedEndpoint.at(0);
  }

  async deleteEndpointById(id: string) {
    await db.delete(endpointTable).where(eq(endpointTable.id, id));
  }

  async hasEndpointWithId(id: string): Promise<boolean> {
    const res = await db
      .select()
      .from(endpointTable)
      .where(eq(endpointTable.id, id));

    return res.length > 0;
  }

  /**
   * Looks up the endpoint with the specified method and path using the
   * UNIQUE(method, path) index instead of scanning the whole table.
   */
  async getEndpointByMethodAndPath(
    method: EndpointConfig['method'],
    path: string,
  ): Promise<EndpointConfig | undefined> {
    const res = await db
      .select()
      .from(endpointTable)
      .where(
        and(eq(endpointTable.method, method), eq(endpointTable.path, path)),
      );
    return res.at(0);
  }

  /**
   * Determines whether an endpoint with the specified method and path are currently stored.
   */
  async hasEndpoint(
    method: EndpointConfig['method'],
    path: string,
  ): Promise<boolean> {
    const res = await db
      .select()
      .from(endpointTable)
      .where(
        and(eq(endpointTable.method, method), eq(endpointTable.path, path)),
      );
    return res.length > 0;
  }
}
