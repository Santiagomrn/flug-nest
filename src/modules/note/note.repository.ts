import { SequelizeCrudRepository } from '@libraries/SequelizeCrudRepository';
import { Note } from './entities/note.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class NoteRepository extends SequelizeCrudRepository<Note> {
  constructor(
    @InjectModel(Note)
    protected model: typeof Note,
    protected sequelize?: Sequelize,
  ) {
    super(sequelize);
  }
}
