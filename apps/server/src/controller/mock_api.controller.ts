import { EndpointConfig, TranspiledSchema } from '@mock-api-builder/schema';
import { All, Controller, Param, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { RESOURCES } from '../constants.js';
import { MockApiService } from '../service/mock_api.service.js';

@Controller(RESOURCES.MOCK_API)
export class MockApiController {
  constructor(private readonly mockApiService: MockApiService) {}

  @All('{*splat}')
  async handleMockRequest(
    @Param('splat') splat: string[],
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TranspiledSchema> {
    const path = splat.join('/');
    const { statusCode, body } = await this.mockApiService.serveMock(
      req.method as EndpointConfig['method'],
      path,
    );
    // Mock responses change whenever the endpoint is edited, and some status
    // codes (404, 410, …) are cacheable by default, so tell every client not
    // to cache them.
    res.set('Cache-Control', 'no-store');
    res.status(statusCode);
    return body;
  }
}
