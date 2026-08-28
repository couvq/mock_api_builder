import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller.js';
import { AppService } from './service/app.service.js';
import { EndpointController } from './controller/endpoint.controller.js';
import { EndpointService } from './service/endpoint.service.js';
import { EndpointRepository } from './repository/endpoint.repository.js';

@Module({
  imports: [],
  controllers: [AppController, EndpointController],
  providers: [AppService, EndpointService, EndpointRepository],
})
export class AppModule {}
