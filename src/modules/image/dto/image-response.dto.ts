import { ApiProperty } from '@nestjs/swagger';

export class ImageResponseDto {
  @ApiProperty({ example: 'v3-uuid-id' })
  id: string;

  @ApiProperty({ example: 'https://cdn.example.com/products/shoe-1.jpg' })
  url: string;

  @ApiProperty({ example: 'product-uuid-id' })
  productId: string;
}
