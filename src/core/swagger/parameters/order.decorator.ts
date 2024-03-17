import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiQueryOrder = () => {
  return applyDecorators(
    ApiQuery({
      name: 'order',
      description:
        'Defines the order of the result set by a defined property, first value can be any table property, second value must be "ASC" or "DESC".\n\n---\n\nQuery schema  \n+ **Order using a single parameter:** [["propertyA","ASC"]]\n+ **Order using multiple parameters:** [["propertyA","ASC"],["propertyB","DESC"]]\n',
      required: false,
      schema: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    }),
  );
};
