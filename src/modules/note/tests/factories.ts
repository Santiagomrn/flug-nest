import { faker } from '@faker-js/faker';
import { Note } from '../entities/note.entity';
import _ from 'lodash';
import { CreateNoteDto } from '../dto/create-note.dto';
import { plainToClass } from 'class-transformer';
import { UpdateNoteDto } from '../dto/update-note.dto';

const createRandomNote = (): Note => {
  return new Note({
    id: faker.number.int(),
    title: faker.string.alpha(8),
    content: faker.lorem.paragraph(),
    userId: faker.number.int(),
  });
};

export function NoteFactory(count: number): Note[];
export function NoteFactory(count?: number): Note;
export function NoteFactory(count: number): Note[] | Note {
  if (!_.isNil(count) && _.isNumber(count)) {
    return faker.helpers.multiple(createRandomNote, { count });
  }
  return createRandomNote();
}

const createRandomCreateNoteDto = (): CreateNoteDto => {
  return plainToClass(CreateNoteDto, {
    title: faker.string.alpha(8),
    content: faker.lorem.paragraph(),
    userId: faker.number.int(),
  });
};

export function CreateNoteDtoFactory(count: number): CreateNoteDto[];
export function CreateNoteDtoFactory(count?: number): CreateNoteDto;
export function CreateNoteDtoFactory(
  count: number,
): CreateNoteDto[] | CreateNoteDto {
  if (!_.isNil(count) && _.isNumber(count)) {
    return faker.helpers.multiple(createRandomCreateNoteDto, { count });
  }
  return createRandomCreateNoteDto();
}

export function UpdateNoteDtoFactory(count: number): UpdateNoteDto[];
export function UpdateNoteDtoFactory(count?: number): UpdateNoteDto;
export function UpdateNoteDtoFactory(
  count: number,
): UpdateNoteDto[] | UpdateNoteDto {
  if (!_.isNil(count) && _.isNumber(count)) {
    return faker.helpers.multiple(createRandomCreateNoteDto, { count });
  }
  return createRandomCreateNoteDto();
}
