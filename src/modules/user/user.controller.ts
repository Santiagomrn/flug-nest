import {
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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseOffsetPipe } from '@pipes/parseOffset.pipe';
import { ParseLimitPipe } from '@pipes/parseLimit.pipe';
import { ParseWherePipe } from '@pipes/parseWhere.pipe';
import { IncludeOptions, OrderItem, WhereOptions } from 'sequelize';
import { ParseIncludePipe } from '@pipes/parseInclude.pipe';
import { ParseOrderPipe } from '@pipes/parseOrder.pipe';
import { ValidateJWT } from '@modules/auth/decorators/validateJWT.decorator';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ParseAttributesPipe } from '@pipes/parseAttributes.pipe';
import { ApiQueryAttributes } from '@swagger/parameters/attributes.decorator';
import { ApiQueryWhere } from '@swagger/parameters/where.decorator';
import { ApiQueryInclude } from '@swagger/parameters/include.decorator';
import { ApiOkResponsePaginatedData } from '@swagger/httpResponses/OkPaginatedData.decorator';
import { ApiQueryPagination } from '@swagger/utils/pagination.decorator';
import { ApiCommonResponses } from '@swagger/utils/commonResponses.decorator';
import { ApiCreatedResponseData } from '@swagger/httpResponses/Created.decorator';
import { ApiOkResponseData } from '@swagger/httpResponses/Ok.decorator';
import { IsSelfUserOrIsRole } from '@modules/auth/decorators/isSelfUserOrIsRole.decorator';
import { ROLES } from '@modules/role/enums/roles.enum';
import { IsRole } from '@modules/auth/decorators/isRole.decorator';
import { UserResponseDto } from './dto/user-response.dto';

@ApiExtraModels(User)
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all User entries' })
  @ApiQueryAttributes()
  @ApiQueryWhere()
  @ApiQueryInclude()
  @ApiQueryPagination()
  @ApiOkResponsePaginatedData(UserResponseDto)
  @ApiCommonResponses()
  @IsSelfUserOrIsRole(ROLES.ADMIN)
  @ValidateJWT()
  @Get()
  async findAll(
    @Query('where', ParseWherePipe) where?: WhereOptions,
    @Query('offset', ParseOffsetPipe) offset?: number,
    @Query('limit', ParseLimitPipe) limit?: number,
    @Query('order', ParseOrderPipe) order?: OrderItem[],
    @Query('attributes', ParseAttributesPipe)
    attributes?: string[],
    @Query('include', new ParseIncludePipe(User))
    include?: IncludeOptions[],
  ) {
    return await this.userService.findAll({
      where,
      attributes,
      offset,
      limit,
      include,
      order,
    });
  }

  @ApiOperation({ summary: 'Get User entry by id' })
  @ApiCommonResponses()
  @ApiQueryAttributes()
  @ApiOkResponseData(UserResponseDto)
  @ApiQueryInclude()
  @IsSelfUserOrIsRole(ROLES.ADMIN)
  @ValidateJWT()
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('include', new ParseIncludePipe(User))
    include?: IncludeOptions[],
    @Query('attributes', ParseAttributesPipe)
    attributes?: string[],
  ) {
    return await this.userService.findOne(+id, include, attributes);
  }

  @ApiOperation({ summary: 'Create a User' })
  @ApiCommonResponses()
  @ApiCreatedResponseData(UserResponseDto)
  @IsRole(ROLES.ADMIN)
  @ValidateJWT()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Update User entry by id' })
  @ApiCommonResponses()
  @ApiOkResponseData(UserResponseDto)
  @IsSelfUserOrIsRole(ROLES.ADMIN)
  @ValidateJWT()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete User entry by id' })
  @ApiCommonResponses()
  @HttpCode(204)
  @IsSelfUserOrIsRole(ROLES.ADMIN)
  @ValidateJWT()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(+id);
  }
}
