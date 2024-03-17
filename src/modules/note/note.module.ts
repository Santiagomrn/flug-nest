import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Note } from './entities/note.entity';
import { NoteRepository } from './note.repository';

@Module({
  imports: [SequelizeModule.forFeature([Note])],
  controllers: [NoteController],
  providers: [NoteService, NoteRepository],
  exports: [SequelizeModule],
})
export class NoteModule {}
