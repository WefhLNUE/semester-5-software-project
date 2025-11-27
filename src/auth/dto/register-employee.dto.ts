import { IsString, IsOptional, IsEnum, IsEmail, IsDateString, IsNotEmpty } from 'class-validator';
import { Gender, MaritalStatus, ContractType, WorkType } from '../../employee-profile/enums/employee-profile.enums';

export class RegisterEmployeeDto {
  // User base
  @IsString() @IsNotEmpty()
  firstName: string;

  @IsOptional() @IsString()
  middleName?: string;

  @IsString() @IsNotEmpty()
  lastName: string;

  @IsString() @IsNotEmpty()
  nationalId: string;

  @IsString() @IsNotEmpty()
  password: string;

  @IsOptional() @IsEnum(Gender)
  gender?: Gender;

  @IsOptional() @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @IsOptional() @IsDateString()
  dateOfBirth?: Date;

  // Contact
  @IsOptional() @IsEmail()
  personalEmail?: string;

  @IsOptional() @IsString()
  mobilePhone?: string;

  @IsOptional() @IsString()
  homePhone?: string;

  @IsOptional()
  address?: {
    city?: string;
    streetAddress?: string;
    country?: string;
  };

  // Employee-specific
  @IsString()
  employeeNumber: string;

  @IsDateString()
  dateOfHire: Date;

  @IsOptional() @IsEmail()
  workEmail?: string;

  @IsOptional() @IsString()
  biography?: string;

  @IsOptional() @IsEnum(ContractType)
  contractType?: ContractType;

  @IsOptional() @IsEnum(WorkType)
  workType?: WorkType;

  @IsOptional()
  primaryDepartmentId?: string;

  @IsOptional()
  primaryPositionId?: string;

  // Role assignment
  @IsString()
  systemRole: string; // e.g., "HR Manager", "department employee"
}
