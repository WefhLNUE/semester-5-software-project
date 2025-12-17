import { IsEmail, IsEnum, IsString } from 'class-validator';

export enum UserType {
  EMPLOYEE = 'employee',
  CANDIDATE = 'candidate',
}

export class LoginDto {
  @IsEmail()
  workEmail: string;

  @IsString()
  password: string;

  @IsEnum(UserType)
  userType: UserType;
}
