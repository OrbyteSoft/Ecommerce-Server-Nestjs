import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from '../../products/dto/product-response.dto';

export class CartItemResponseDto {
  @ApiProperty({ example: 'uuid-cart-item' })
  id: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ type: () => ProductResponseDto })
  product: ProductResponseDto;
}

export class CartResponseDto {
  @ApiProperty({ type: [CartItemResponseDto] })
  items: CartItemResponseDto[];

  @ApiProperty({ example: 1500.5 })
  subtotal: number;

  @ApiProperty({ example: 2 })
  itemCount: number;
}
