import { applyDecorators } from '@nestjs/common';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

export const ApiInternalServerErrorResponseData = () => {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      description: 'An error ocurred while performing the request.',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          statusCode: { type: 'integer' },
          error: { type: 'string' },
        },
        example: {
          message: 'Internal Server Error',
          statusCode: 500,
          error: 'Internal Server Error',
        },
      },
    }),
  );
};
