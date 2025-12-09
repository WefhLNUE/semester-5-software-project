import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  workEmail: string;

  @IsString()
  password: string;
}
