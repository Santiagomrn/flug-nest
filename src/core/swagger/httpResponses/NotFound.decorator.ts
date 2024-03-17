import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';

export const ApiNotFoundResponseData = () => {
  return applyDecorators(
    ApiNotFoundResponse({
      description: 'The requested resource was not found.',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' },
          statusCode: { type: 'integer' },
        },
        example: {
          message: 'Not Found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    }),
  );
};
