import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiQueryAttributes = () => {
  return applyDecorators(
    ApiQuery({
      name: 'attributes',
      description:
        'Allows to exclude specific parameters from the result set.\n\n----\n\nQuery schema  \n+ **Exclude a single parameter:** {"exclude": ["parameterA"]}\n+ **Exclude multiple parameters:** {"exclude": ["parameterA", "parameterB"]}\n',
      required: false,
      schema: {
        type: 'string',
      },
    }),
  );
};
