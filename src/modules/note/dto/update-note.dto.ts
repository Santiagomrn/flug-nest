import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';
export class UpdateNoteDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsOptional()
  @IsString()
  title: string;

  @IsNotEmpty()
  @MaxLength(255)
  @IsOptional()
  @IsString()
  content: string;
}
