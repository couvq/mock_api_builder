import { EndpointConfig, TranspiledSchema } from '@mock-api-builder/schema';
import { All, Controller, Param, Req } from '@nestjs/common';
import { RESOURCES } from '../constants.js';
import { MockApiService } from '../service/mock_api.service.js';

@Controller(RESOURCES.MOCK_API)
export class MockApiController {
  constructor(private readonly mockApiService: MockApiService) {}

  @All('{*splat}')
  async handleMockRequest(
    @Param('splat') splat: string[],
    @Req() req: Request,
  ): Promise<TranspiledSchema> {
    const path = splat.join('/');
    return await this.mockApiService.serveMock(
      req.method as EndpointConfig['method'],
      path,
    );
  }
}
