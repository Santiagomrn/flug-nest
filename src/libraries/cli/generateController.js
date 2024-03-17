function isString(str) {
  if (str != null && typeof str.valueOf() === 'string') {
    return true;
  }
  return false;
}

exports.generateController = (opts) => {
  const { name, belongsUser = false } = opts;
  if (!isString(name)) throw Error();
  const lowerCaseName = name.toLowerCase();
  const belongsUserPostTemplate = ` @AppendUser()
  @ValidateJWT()`;
  const belongsUserFindAllTemplate = `@FilterOwner()
  @ValidateJWT()`;
  const belongsUserOwnerTemplate = `@IsOwner(${name}Service)
  @ValidateJWT()`;

  const template = `import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ${name}Service } from './${lowerCaseName}.service';
import { Create${name}Dto } from './dto/create-${lowerCaseName}.dto';
import { Update${name}Dto } from './dto/update-${lowerCaseName}.dto';
import { ParseOffsetPipe } from '@pipes/parseOffset.pipe';
import { ParseLimitPipe } from '@pipes/parseLimit.pipe';
import { ParseWherePipe } from '@pipes/parseWhere.pipe';
import { IncludeOptions, OrderItem, WhereOptions } from 'sequelize';
import { ParseIncludePipe } from '@pipes/parseInclude.pipe';
import { ParseOrderPipe } from '@pipes/parseOrder.pipe';
import { ${name} } from './entities/${lowerCaseName}.entity';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCommonResponses } from '@swagger/utils/commonResponses.decorator';
import { ParseAttributesPipe } from '@pipes/parseAttributes.pipe';
import { ApiQueryAttributes } from '@swagger/parameters/attributes.decorator';
import { ApiQueryWhere } from '@swagger/parameters/where.decorator';
import { ApiQueryInclude } from '@swagger/parameters/include.decorator';
import { ApiQueryPagination } from '@swagger/utils/pagination.decorator';
import { ApiOkResponsePaginatedData } from '@swagger/httpResponses/OkPaginatedData.decorator';
import { ApiOkResponseData } from '@swagger/httpResponses/Ok.decorator';
import { ApiCreatedResponseData } from '@swagger/httpResponses/Created.decorator';
${
  belongsUser
    ? "import { IsOwner } from '@modules/auth/decorators/isOwner.decorator';"
    : ''
}
${
  belongsUser
    ? "import { ValidateJWT } from '@modules/auth/decorators/validateJWT.decorator';"
    : ''
}
${
  belongsUser
    ? "import { FilterOwner } from '@decorators/filterOwner.decorator';"
    : ''
}
${
  belongsUser
    ? "import { AppendUser } from '@decorators/appendUser.decorator';"
    : ''
}

@ApiExtraModels(${name})
@ApiTags('${lowerCaseName}s')
@Controller('${lowerCaseName}s')
export class ${name}Controller {
  constructor(private readonly ${lowerCaseName}Service: ${name}Service) {}

  @ApiOperation({ summary: 'Create a ${name}' })
  @ApiCommonResponses()
  @ApiCreatedResponseData(${name})
 ${belongsUser ? belongsUserPostTemplate : ''}
  @Post()
  async create(@Body() create${name}Dto: Create${name}Dto) {
    return await this.${lowerCaseName}Service.create(create${name}Dto);
  }

  @ApiOperation({ summary: 'Get all ${name} entries' })
  @ApiQueryAttributes()
  @ApiQueryWhere()
  @ApiQueryInclude()
  @ApiQueryPagination()
  @ApiOkResponsePaginatedData(${name})
  @ApiCommonResponses()
  ${belongsUser ? belongsUserFindAllTemplate : ''}
  @Get()
  async findAll(
    @Query('where', ParseWherePipe) where?: WhereOptions,
    @Query('offset', ParseOffsetPipe) offset?: number,
    @Query('limit', ParseLimitPipe) limit?: number,
    @Query('attributes', ParseAttributesPipe)
    attributes?: string[],
    @Query('order', ParseOrderPipe) order?: OrderItem[],
    @Query('include', new ParseIncludePipe(${name}))
    include?: IncludeOptions[],
  ) {
    return await this.${lowerCaseName}Service.findAll({
      where,
      attributes,
      offset,
      limit,
      include,
      order,
    });
  }

  @ApiOperation({ summary: 'Get ${name} entry by id' })
  @ApiCommonResponses()
  @ApiOkResponseData(${name})
  @ApiQueryAttributes()
  @ApiQueryInclude()
  ${belongsUser ? belongsUserOwnerTemplate : ''}
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('include', new ParseIncludePipe(${name}))
    include?: IncludeOptions[],
    @Query('attributes', ParseAttributesPipe)
    attributes?: string[],
  ) {
    return await this.${lowerCaseName}Service.findOne(+id, include, attributes);
  }

  @ApiOperation({ summary: 'Update ${name} entry by id' })
  @ApiCommonResponses()
  @ApiOkResponseData(${name})
  ${belongsUser ? belongsUserOwnerTemplate : ''}
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() update${name}Dto: Update${name}Dto) {
    return await this.${lowerCaseName}Service.update(+id, update${name}Dto);
  }

  @ApiOperation({ summary: 'Delete ${name} entry by id' })
  @ApiCommonResponses()
  @HttpCode(204)
  ${belongsUser ? belongsUserOwnerTemplate : ''}
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.${lowerCaseName}Service.remove(+id);
  }
}
`;
  return template;
};
