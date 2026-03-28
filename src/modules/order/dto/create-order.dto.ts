import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  Min,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreateOrderDto {
  @ApiProperty({ example: 'uuid-shipping-address' })
  @IsUUID()
  @IsNotEmpty()
  shippingAddrId: string;

  @ApiProperty({ example: 'uuid-billing-address' })
  @IsUUID()
  @IsNotEmpty()
  billingAddrId: string;

  @ApiProperty({ enum: PaymentMethod, example: 'COD' })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: '9841234567' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Deliver after 5 PM' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 'ESEWA123456XYZ' })
  @IsString()
  @IsOptional()
  transactionId?: string;

  @ApiPropertyOptional({
    example: 9550,
    description: 'Final total with discount applied',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  total?: number;

  @ApiPropertyOptional({ example: 500, description: 'Discount amount applied' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;
}
