import { AuthType } from '../entities/user.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  authType: AuthType = AuthType.Email;

  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  @IsOptional()
  lastName: string;
}
