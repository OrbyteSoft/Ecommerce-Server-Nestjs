import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
  IsUrl,
  IsBoolean,
} from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    example: 'Home Appliances',
    description: 'The updated display name of the category',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'home-appliances',
    description: 'Updated URL-friendly identifier.',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;

  @ApiPropertyOptional({
    example: 'Updated description for home appliances',
    description: 'Updated detailed description of the category',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/home.jpg',
    description: 'Updated public URL for the category icon or banner',
  })
  @IsOptional()
  @IsUrl()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Update visibility status in the storefront',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description:
      'Update the parent category UUID to move this category in the hierarchy',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
