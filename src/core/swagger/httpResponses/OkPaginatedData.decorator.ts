import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedDto } from '@common/dto/paginated.dto';

export const ApiOkResponsePaginatedData = (responseSchema) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'The request has succeeded.',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(responseSchema) },
              },
            },
          },
        ],
      },
    }),
  );
};
