import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiQueryWhere = () => {
  return applyDecorators(
    ApiQuery({
      name: 'where',
      description:
        'Allows to filter result set with the specific requested parameters, you can use a any parameter or specific operators.\n\n---\n\nQuery schema  \n+ **Filer by a single parameter:** [{"parameterA": "lorem"}]\n+ **Filter using multiple parameters:** [{"parameterA": "lorem"},{"parameterB": "ipsum"}]\n+ **Filter by using operators with single parameter:** [{"parameterA": {"$operator": "lorem"}}]\n+ **Filter by using operators with array ($or & $and):** [{"parameterA": {"$operator": ["1", "2", "3"]}}]\n',
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
