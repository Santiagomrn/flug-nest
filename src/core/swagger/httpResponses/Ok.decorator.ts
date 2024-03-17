import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiOkResponseData = (responseSchema) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'The request has succeeded.',
      schema: {
        $ref: getSchemaPath(responseSchema),
      },
    }),
  );
};
