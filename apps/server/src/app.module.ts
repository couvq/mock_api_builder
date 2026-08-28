import { Module } from '@nestjs/common';
import { EndpointController } from './controller/endpoint.controller.js';
import { EndpointRepository } from './repository/endpoint.repository.js';
import { EndpointService } from './service/endpoint.service.js';

@Module({
  imports: [],
  controllers: [EndpointController],
  providers: [EndpointService, EndpointRepository],
})
export class AppModule {}
