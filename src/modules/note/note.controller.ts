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
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ParseOffsetPipe } from '@pipes/parseOffset.pipe';
import { ParseLimitPipe } from '@pipes/parseLimit.pipe';
import { IncludeOptions, OrderItem, WhereOptions } from 'sequelize';
import { ParseIncludePipe } from '@pipes/parseInclude.pipe';
import { ParseOrderPipe } from '@pipes/parseOrder.pipe';
import { Note } from './entities/note.entity';
import { IsOwner } from '@modules/auth/decorators/isOwner.decorator';
import { ValidateJWT } from '@modules/auth/decorators/validateJWT.decorator';
import { FilterOwner } from '@decorators/filterOwner.decorator';
import { AppendUser } from '@decorators/appendUser.decorator';
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
import { ParseWherePipe } from '@pipes/parseWhere.pipe';

@ApiExtraModels(Note)
@ApiTags('notes')
@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @ApiOperation({ summary: 'Create a Note' })
  @ApiCommonResponses()
  @ApiCreatedResponseData(Note)
  @AppendUser()
  @ValidateJWT()
  @Post()
  async create(@Body() createNoteDto: CreateNoteDto) {
    return await this.noteService.create(createNoteDto);
  }

  @ApiOperation({ summary: 'Get all Note entries' })
  @ApiQueryAttributes()
  @ApiQueryWhere()
  @ApiQueryInclude()
  @ApiQueryPagination()
  @ApiOkResponsePaginatedData(Note)
  @ApiCommonResponses()
  @FilterOwner()
  @ValidateJWT()
  @Get()
  async findAll(
    @Query('where', ParseWherePipe) where?: WhereOptions,
    @Query('offset', ParseOffsetPipe) offset?: number,
    @Query('limit', ParseLimitPipe) limit?: number,
    @Query('attributes', ParseAttributesPipe)
    attributes?: string[],
    @Query('order', ParseOrderPipe) order?: OrderItem[],
    @Query('include', new ParseIncludePipe(Note))
    include?: IncludeOptions[],
  ) {
    return await this.noteService.findAll({
      where,
      attributes,
      offset,
      limit,
      include,
      order,
    });
  }

  @ApiOperation({ summary: 'Get Note entry by id' })
  @ApiCommonResponses()
  @ApiOkResponseData(Note)
  @ApiQueryAttributes()
  @ApiQueryInclude()
  @IsOwner(NoteService)
  @ValidateJWT()
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('include', new ParseIncludePipe(Note))
    include?: IncludeOptions[],
    @Query('attributes', ParseAttributesPipe)
    attributes?: string[],
  ) {
    return await this.noteService.findOne(+id, include, attributes);
  }

  @ApiOperation({ summary: 'Update Note entry by id' })
  @ApiCommonResponses()
  @ApiOkResponseData(Note)
  @IsOwner(NoteService)
  @ValidateJWT()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return await this.noteService.update(+id, updateNoteDto);
  }

  @ApiOperation({ summary: 'Delete Note entry by id' })
  @ApiCommonResponses()
  @HttpCode(204)
  @IsOwner(NoteService)
  @ValidateJWT()
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.noteService.remove(+id);
  }
}
