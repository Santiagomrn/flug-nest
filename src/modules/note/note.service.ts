import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteRepository } from './note.repository';
import { IncludeOptions, OrderItem, WhereOptions } from 'sequelize';
import { Note } from './entities/note.entity';
import { PaginatedDto } from '@common/dto/paginated.dto';

@Injectable()
export class NoteService {
  constructor(private noteRepository: NoteRepository) {}
  async create(createNoteDto: CreateNoteDto) {
    return await this.noteRepository.create(createNoteDto);
  }

  async findAll(options?: {
    include?: IncludeOptions[];
    where?: WhereOptions<Note>;
    limit?: number;
    offset?: number;
    order?: OrderItem[];
    attributes?: string[];
  }): Promise<PaginatedDto<Note>> {
    return await this.noteRepository.findAndCountAll(options);
  }

  async findOne(id: number, include?: IncludeOptions[], attributes?: string[]) {
    return await this.noteRepository.findOneById(id, include, attributes);
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    return await this.noteRepository.update(id, updateNoteDto);
  }

  async remove(id: number) {
    return await this.noteRepository.delete(id);
  }
}
