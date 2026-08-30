import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './clients/endpointDbClient.js';

async function bootstrap() {
  migrate(db, { migrationsFolder: './drizzle' });
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
