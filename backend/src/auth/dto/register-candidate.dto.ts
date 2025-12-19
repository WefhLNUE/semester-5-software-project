import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsEnum,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Gender, MaritalStatus } from '../../employee-profile/enums/employee-profile.enums';

export class AddressDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  streetAddress?: string;

  @IsOptional()
  @IsString()
  country?: string;
}

export class RegisterCandidateDto {
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  lastName: string;

  @IsEmail()
  personalEmail: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  nationalId: string;

  @IsOptional()
  @IsString()
  mobilePhone?: string;

  @IsOptional()
  @IsString()
  homePhone?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  address?: AddressDto;



}
