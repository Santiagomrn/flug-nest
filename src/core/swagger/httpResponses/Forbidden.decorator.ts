import { applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse } from '@nestjs/swagger';

export const ApiForbiddenResponseData = () => {
  return applyDecorators(
    ApiForbiddenResponse({
      description: "The user doesn't have access to the requested resource.",
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' },
          statusCode: { type: 'integer' },
        },
        example: {
          message: 'Forbidden resource',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    }),
  );
};
