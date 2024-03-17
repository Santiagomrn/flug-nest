import { applyDecorators } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

export const ApiUnauthorizedResponseData = () => {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'The user could not be authenticated',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          statusCode: { type: 'integer' },
          error: { type: 'string' },
        },
        example: {
          message: 'Unauthorized',
          statusCode: 401,
          error: 'Unauthorized',
        },
      },
    }),
  );
};
