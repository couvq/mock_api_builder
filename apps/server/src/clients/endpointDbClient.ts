import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as t from 'drizzle-orm/sqlite-core';
import type { EndpointConfig } from '@mock-api-builder/schema';

// @ts-ignore
export const db = drizzle(process.env.DB_FILE_NAME);

export const endpointTable = t.sqliteTable(
  'endpoints',
  {
    id: t.text().primaryKey(), // TODO: can I have the database assign this on create?
    method: t.text().notNull().$type<EndpointConfig['method']>(),
    path: t.text().notNull(),
    statusCode: t.integer('status_code').notNull().default(200),
    delay: t.integer().notNull().default(0),
    responseSchema: t
      .text('response_schema', { mode: 'json' })
      .$type<EndpointConfig['responseSchema']>()
      .notNull(),
  },
  // create an index on method + path to support our query pattern by method + path for mock requests
  (table) => [t.uniqueIndex('method_path_idx').on(table.method, table.path)],
);
