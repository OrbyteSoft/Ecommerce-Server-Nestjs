import { ApiProperty } from '@nestjs/swagger';

class WishlistCategoryResponseDto {
  @ApiProperty({ example: 'Electronics' })
  name: string;

  @ApiProperty({ example: 'electronics' })
  slug: string;
}

class WishlistImageResponseDto {
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  url: string;
}

class WishlistProductResponseDto {
  @ApiProperty({ example: 'uuid-product-123' })
  id: string;

  @ApiProperty({ example: 'iPhone 15 Pro' })
  name: string;

  @ApiProperty({ example: 'iphone-15-pro' })
  slug: string;

  @ApiProperty({ example: 999.99 })
  price: number;

  @ApiProperty({ type: [WishlistImageResponseDto] })
  images: WishlistImageResponseDto[];

  @ApiProperty({ type: WishlistCategoryResponseDto })
  category: WishlistCategoryResponseDto;
}

export class WishlistItemResponseDto {
  @ApiProperty({ example: 'uuid-wishlist-item-456' })
  id: string;

  @ApiProperty({ example: '2026-02-13T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: WishlistProductResponseDto })
  product: WishlistProductResponseDto;
}

export class WishlistListResponseDto {
  @ApiProperty({ type: [WishlistItemResponseDto] })
  data: WishlistItemResponseDto[];
}

export class WishlistToggleResponseDto {
  @ApiProperty({ example: 'Product added to wishlist' })
  message: string;

  @ApiProperty({ example: true })
  added: boolean;
}
