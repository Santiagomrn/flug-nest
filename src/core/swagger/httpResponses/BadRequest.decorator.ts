import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';

export const ApiBadRequestResponseData = () => {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'The request has invalid data.',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          statusCode: { type: 'integer' },
          error: { type: 'string' },
        },
        example: {
          message: 'Bad Request',
          statusCode: 400,
          error: 'Bad Request',
        },
      },
    }),
  );
};
