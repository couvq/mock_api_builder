import { Module } from '@nestjs/common';
import { EndpointController } from './controller/endpoint.controller.js';
import { EndpointRepository } from './repository/endpoint.repository.js';
import { EndpointService } from './service/endpoint.service.js';
import { MockApiController } from './controller/mock_api.controller.js';
import { MockApiService } from './service/mock_api.service.js';

@Module({
  imports: [],
  controllers: [EndpointController, MockApiController],
  providers: [EndpointService, EndpointRepository, MockApiService],
})
export class AppModule {}
