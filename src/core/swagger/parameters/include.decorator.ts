import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiQueryInclude = () => {
  return applyDecorators(
    ApiQuery({
      name: 'include',
      description:
        'Name of the model to include with the result set. Keep in mind that, in order to know which tables are related with the result set you must search for parameters ending with "...Id", for example: "employeeId", this way we know we can use "employee" as an inlcude parameter.\n\n---\n\nQuery schema  \n+ **Include a single model:** ["modelA"]\n+ **Include multiple models:** ["modelA","modelB"]\n+ **Include a nested model:** [&#123;"modelA": ["modelB"]&#125;]\n+ **Include complex nested models:** [{"modelA": [{"modelB": ["modelC"]}]}]\n+ **Include a single model with where:** [{"model": "modelA", "where":{"parameterA": "lorem"}}]\n',
      required: false,
      schema: {
        type: 'string',
      },
    }),
  );
};
