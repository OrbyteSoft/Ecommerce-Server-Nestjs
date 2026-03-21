import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsUUID,
  IsArray,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'iPhone 15 Pro',
    description: 'The display name of the product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'iphone-15-pro',
    description:
      'URL-friendly identifier. Auto-generated from name if not provided.',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({
    example:
      'The latest flagship smartphone from Apple featuring a titanium design.',
    description:
      'A detailed description of the product features and specifications',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 999.99,
    description: 'The current selling price of the product',
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 1199.99,
    description:
      'The original price before discount (used for "on sale" badges)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAt?: number;

  @ApiPropertyOptional({
    example: 'AAPL-IPH15P-BLK',
    description:
      'Stock Keeping Unit - a unique identifier for inventory tracking',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    example: 50,
    description: 'Total quantity available in the warehouse',
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({
    example: 'https://example.com/main-image.jpg',
    description: 'The primary display image URL for the product list',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Toggle visibility of the product on the storefront',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Highlight this product in the Featured section',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Mark this product as a Best Seller',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isBestSeller?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Mark this product as a New Arrival',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isNewArrival?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Include this product in Flash Deals',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFlashDeal?: boolean;

  @ApiPropertyOptional({
    example: '2026-12-31T23:59:59Z',
    description: 'The expiration date and time for the flash deal',
  })
  @IsOptional()
  @IsDateString()
  flashDealEnd?: string;

  @ApiPropertyOptional({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'The UUID of the category this product belongs to',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    example: [
      'https://example.com/images/iphone-front.jpg',
      'https://example.com/images/iphone-back.jpg',
    ],
    description: 'An array of publicly accessible URLs for product images',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
