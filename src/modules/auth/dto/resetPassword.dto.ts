import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
