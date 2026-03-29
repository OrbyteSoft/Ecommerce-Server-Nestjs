import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, PaymentMethod } from '@prisma/client';

export class OrderItemResponseDto {
  @ApiProperty({ example: 'uuid-product-123' })
  productId: string;

  @ApiProperty({ example: 'Wireless Headphones' })
  productName: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: 1200 })
  price: number;
}

export class OrderSingleResponseDto {
  @ApiProperty({ example: 'uuid-order-456' })
  id: string;

  @ApiProperty({ example: 'ORD-1708250000-1234' })
  orderNumber: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.COD })
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({
    example: '9841234567',
    description: 'Contact phone for delivery',
  })
  phone?: string;

  @ApiPropertyOptional({
    example: 'Leave at the front gate.',
    description: 'Delivery instructions',
  })
  notes?: string;

  @ApiProperty({ example: 2400 })
  subtotal: number;

  @ApiProperty({ example: 500, description: 'Discount applied' })
  discount: number;

  @ApiProperty({ example: 0 })
  tax: number;

  @ApiProperty({ example: 50 })
  shippingFee: number;

  @ApiProperty({ example: 2450 })
  total: number;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty()
  createdAt: Date;
}
