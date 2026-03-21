import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
  Matches,
} from 'class-validator';
import { Role } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'The unique email address of the user',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'StrongPass123!',
    description:
      'Must include: Uppercase, Lowercase, Number, and Special Character',
    minLength: 8,
  })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is too weak. Must include: Uppercase, Lowercase, Number, and Special Character',
  })
  password?: string;

  @ApiPropertyOptional({
    example: 'StrongPass123!',
    description: 'Must match the password field exactly',
  })
  @IsString()
  @IsOptional()
  confirmPassword?: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'The full name of the user',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    enum: Role,
    description: 'User role within the application',
  })
  @IsEnum(Role, { message: 'Invalid user role' })
  @IsOptional()
  role?: Role;
}
