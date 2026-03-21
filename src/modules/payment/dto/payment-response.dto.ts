import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export class PaymentResponseDto {
  @ApiProperty({ description: 'Payment record ID' })
  id: string;

  @ApiProperty({ description: 'Associated Order ID' })
  orderId: string;

  @ApiProperty({ enum: PaymentMethod })
  method: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty()
  amount: number;

  @ApiProperty({ nullable: true })
  reference: string | null;

  @ApiProperty()
  createdAt: Date;
}
