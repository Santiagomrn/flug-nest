import { applyDecorators } from '@nestjs/common';
import { ApiConflictResponse } from '@nestjs/swagger';

export const ApiConflictResponseData = () => {
  return applyDecorators(
    ApiConflictResponse({
      description:
        'The request conflicts with the current state of the server.',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' },
          statusCode: { type: 'integer' },
        },
        example: {
          message: 'Conflict',
          statusCode: 409,
          error: 'Conflict',
        },
      },
    }),
  );
};
