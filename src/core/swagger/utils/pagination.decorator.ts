import { applyDecorators } from '@nestjs/common';
import { ApiQueryLimit } from '@swagger/parameters/limit.decorator';
import { ApiQueryOffset } from '@swagger/parameters/offset.decorator';
import { ApiQueryOrder } from '@swagger/parameters/order.decorator';

export const ApiQueryPagination = () => {
  return applyDecorators(ApiQueryLimit(), ApiQueryOffset(), ApiQueryOrder());
};
