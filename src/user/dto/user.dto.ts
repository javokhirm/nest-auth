import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Role } from '../users.interface';

export class CreateUserDto {
  @IsDefined()
  @IsNotEmpty()
  firstName: string;

  @IsDefined()
  @IsNotEmpty()
  lastName: string;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  refreshToken: string;
}
export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Role)
  role?: Role;

  refreshToken?: string;
}
