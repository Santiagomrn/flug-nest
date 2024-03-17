import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiCreatedResponseData = (responseSchema) => {
  return applyDecorators(
    ApiCreatedResponse({
      description: 'The request has succeeded.',
      schema: {
        $ref: getSchemaPath(responseSchema),
      },
    }),
  );
};
