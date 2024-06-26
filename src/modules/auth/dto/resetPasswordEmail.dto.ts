import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
export class ResetPasswordEmailDto {
  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  email: string;
}
