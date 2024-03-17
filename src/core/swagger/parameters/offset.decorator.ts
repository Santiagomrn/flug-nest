import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiQueryOffset = () => {
  return applyDecorators(
    ApiQuery({
      name: 'offset',
      description:
        'Number of items to skip before starting to collect the result set.',
      required: false,
      schema: {
        type: 'integer',
        minimum: 0,
        default: 0,
      },
    }),
  );
};
