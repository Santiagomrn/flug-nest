import { ApiHideProperty } from '@nestjs/swagger';

export class PaginatedDto<TData> {
  count: number;
  limit: number;
  offset: number;
  @ApiHideProperty()
  data: TData[];
}
