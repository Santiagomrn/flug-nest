import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiQueryLimit = () => {
  return applyDecorators(
    ApiQuery({
      name: 'limit',
      description: 'Number of items to return.',
      required: false,
      schema: {
        type: 'integer',
        minimum: 1,
        default: 99,
      },
    }),
  );
};
