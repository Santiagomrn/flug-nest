import { applyDecorators } from '@nestjs/common';
import { ApiRequestTimeoutResponse } from '@nestjs/swagger';

export const ApiRequestTimeoutResponseData = () => {
  return applyDecorators(
    ApiRequestTimeoutResponse({
      description: 'Server Timeout',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' },
          statusCode: { type: 'integer' },
        },
        example: {
          message: 'Request Timeout',
          statusCode: 408,
          error: 'Request Timeout',
        },
      },
    }),
  );
};
