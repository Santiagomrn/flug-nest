import { Test, TestingModule } from '@nestjs/testing';
import { NoteController } from '../note.controller';
import { NoteService } from '../note.service';
import {
  CreateNoteDtoFactory,
  NoteFactory,
  UpdateNoteDtoFactory,
} from './factories';
import { Note } from '../entities/note.entity';
import { testDatabaseModule } from '@core/database/testDatabase';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { JwtService } from '@nestjs/jwt';

describe('Note Controller', () => {
  let controller: NoteController, service: NoteService;
  const createTestingModule = async () => {
    const mockNoteService = {
      findOne: async () => {},
      findAll: async () => {},
      create: jest.fn(async (dto: CreateNoteDto) => {
        return Note.build({
          id: Math.round(Math.random() * (1000 - 1) + 1),
          ...dto,
        });
      }),
      update: jest.fn(async (id: number, dto: UpdateNoteDto) => {
        return Note.build({
          id: id,
          ...dto,
        });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [testDatabaseModule, SequelizeModule.forFeature([Note])],
      controllers: [NoteController],
      providers: [NoteService, JwtService],
    })
      .overrideProvider(NoteService)
      .useValue(mockNoteService)
      .compile();

    return module;
  };
  beforeAll(async () => {
    const module = await createTestingModule();
    controller = module.get<NoteController>(NoteController);
    service = module.get<NoteService>(NoteService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a note', async () => {
    const mockedNote: Note = NoteFactory();
    jest.spyOn(service, 'findOne').mockImplementation(
      jest.fn(async (id) => {
        mockedNote.id = id;
        return mockedNote;
      }),
    );
    expect(await controller.findOne(mockedNote.id)).toStrictEqual(mockedNote);
  });

  it('should return an array of notes', async () => {
    const mockedNotes = NoteFactory(10);
    jest.spyOn(service, 'findAll').mockImplementation(
      jest.fn(async () => {
        return { count: 10, limit: 10, offset: 0, data: mockedNotes };
      }),
    );
    expect(await controller.findAll()).toStrictEqual({
      count: 10,
      limit: 10,
      offset: 0,
      data: mockedNotes,
    });
  });

  it('should create a note', async () => {
    const createNoteDto: CreateNoteDto = CreateNoteDtoFactory();
    expect(await controller.create(createNoteDto)).toMatchObject({
      id: expect.any(Number),
      ...createNoteDto,
    });
  });

  it('should update a note', async () => {
    const updateNoteDto: UpdateNoteDto = UpdateNoteDtoFactory();
    const id = 1;
    expect(await controller.update(id, updateNoteDto)).toMatchObject({
      id,
      ...updateNoteDto,
    });
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });
});
