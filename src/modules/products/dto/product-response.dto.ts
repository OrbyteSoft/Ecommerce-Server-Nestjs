import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ImageResponseDto } from '../../image/dto/image-response.dto';

export class ProductResponseDto {
  @ApiProperty({ example: 'uuid-product-1' })
  id: string;

  @ApiProperty({ example: 'iPhone 15 Pro' })
  name: string;

  @ApiProperty({ example: 'iphone-15-pro' })
  slug: string;

  @ApiProperty({ example: 'Detailed description here' })
  description: string;

  @ApiProperty({ example: 999.99 })
  price: number;

  @ApiPropertyOptional({ example: 1199.99 })
  compareAt?: number;

  @ApiPropertyOptional({ example: 'SKU123' })
  sku?: string;

  @ApiProperty({ example: 50 })
  stock: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: false, description: 'Is featured on homepage' })
  isFeatured: boolean;

  @ApiProperty({ example: false, description: 'Is marked as a best seller' })
  isBestSeller: boolean;

  @ApiProperty({ example: true, description: 'Is displayed in new arrivals' })
  isNewArrival: boolean;

  @ApiProperty({ example: false, description: 'Is part of a flash deal' })
  isFlashDeal: boolean;

  @ApiPropertyOptional({
    example: '2026-12-31T23:59:59.000Z',
    description: 'Expiry date for flash deals',
  })
  flashDealEnd?: Date;

  @ApiPropertyOptional({ example: 'uuid-category-1' })
  categoryId?: string;

  // Now using the single, imported source of truth
  @ApiProperty({ type: [ImageResponseDto] })
  images: ImageResponseDto[];

  @ApiProperty({ example: '2026-02-13T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-13T12:00:00.000Z' })
  updatedAt: Date;
}

export class ProductSingleResponseDto {
  @ApiProperty({ type: ProductResponseDto })
  data: ProductResponseDto;
}

export class ProductListResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data: ProductResponseDto[];

  @ApiProperty()
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
