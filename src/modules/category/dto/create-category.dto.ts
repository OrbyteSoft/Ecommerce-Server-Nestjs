import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
  IsUrl,
  IsBoolean,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Electronics',
    description: 'The unique display name of the category',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: 'electronics',
    description:
      'URL-friendly identifier. Auto-generated from name if not provided.',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  slug?: string;

  @ApiPropertyOptional({
    example: 'High-end gadgets and consumer electronics',
    description: 'A detailed description of the category content',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/electronics.jpg',
    description: 'Publicly accessible URL for the category icon or banner',
  })
  @IsOptional()
  @IsUrl()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Visibility status in the storefront',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'UUID of the parent category for creating nested hierarchies',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
