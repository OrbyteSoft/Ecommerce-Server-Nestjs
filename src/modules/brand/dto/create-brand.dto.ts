import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ example: 'Nike' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'nike' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ example: 'https://cdn.com/nike.png' })
  @IsOptional()
  @IsString()
  logoUrl?: string;
}
