import { ApiHideProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsNumber,
} from 'class-validator';
export class CreateNoteDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  title: string;

  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  content: string;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  userId: number;
}
