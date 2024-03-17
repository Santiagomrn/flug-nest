import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiImATeapotResponse = () => {
  return applyDecorators(
    ApiResponse({
      status: 418,
      description: 'The server is a Teapot',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' },
          statusCode: { type: 'integer' },
        },
        example: {
          message: "I'm a Teapot",
          error: "I'm a Teapot",
          statusCode: 418,
        },
      },
    }),
  );
};
