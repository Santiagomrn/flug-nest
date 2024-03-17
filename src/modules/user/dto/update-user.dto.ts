import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(8)
  @IsString()
  password?: string;

  @IsOptional()
  @MaxLength(255)
  @IsString()
  firstName?: string;

  @IsOptional()
  @MaxLength(255)
  @IsString()
  lastName?: string;
}
