import { applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponseData } from '@swagger/httpResponses/Forbidden.decorator';
import { ApiImATeapotResponse } from '@swagger/httpResponses/ImATeapot.decorator';
import { ApiInternalServerErrorResponseData } from '@swagger/httpResponses/InternalServerError';
import { ApiNotFoundResponseData } from '@swagger/httpResponses/NotFound.decorator';
import { ApiUnauthorizedResponseData } from '@swagger/httpResponses/Unauthorized.decorator';

export const ApiCommonResponses = () => {
  return applyDecorators(
    ApiInternalServerErrorResponseData(),
    ApiNotFoundResponseData(),
    ApiForbiddenResponseData(),
    ApiUnauthorizedResponseData(),
    ApiImATeapotResponse(),
  );
};
