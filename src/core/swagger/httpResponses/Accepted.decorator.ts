import { applyDecorators } from '@nestjs/common';
import { ApiAcceptedResponse } from '@nestjs/swagger';

export const ApiAcceptedResponseData = () => {
  return applyDecorators(
    ApiAcceptedResponse({
      description: 'The request has succeeded.',
      schema: {
        type: 'object',
        properties: {},
      },
    }),
  );
};
