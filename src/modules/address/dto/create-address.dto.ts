import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  line1: string;

  @ApiProperty({ example: 'Apt 4B', required: false })
  @IsString()
  @IsOptional()
  line2?: string;

  @ApiProperty({ example: 'Kathmandu' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Bagmati', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'Nepal' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: '44600' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;
}
